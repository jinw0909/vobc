'use client'

// import { useState, type ChangeEvent } from 'react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import FileHandler from '@tiptap/extension-file-handler'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { NodeSelection } from '@tiptap/pm/state'
import { useAuthFetch } from "@/providers/hooks/useAuthFetch";

import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code2,
    Heading2,
    ImagePlus,
    Italic,
    Link2,
    List,
    ListOrdered,
    Quote,
    Redo2,
    Strikethrough,
    Undo2,
    Unlink,
} from 'lucide-react'

import styles from './styles.module.css'

type UploadResponse = {
    url: string
}

type ToolbarButtonProps = {
    label: string
    active?: boolean
    disabled?: boolean
    onClick: () => void
    children: React.ReactNode
}

async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        throw new Error('failed to upload image.')
    }

    const data = (await response.json()) as UploadResponse
    return data.url
}

function isImageFile(file: File) {
    return file.type.startsWith('image/')
}

function ToolbarButton({
                           label,
                           active = false,
                           disabled = false,
                           onClick,
                           children,
                       }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            className={`${styles.toolbarButton} ${
                active ? styles.toolbarButtonActive : ''
            }`}
            aria-label={label}
            title={label}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

function addLink(editor: Editor) {
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('enter link url', previousUrl ?? 'https://')

    if (url === null) {
        return
    }

    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
    }

    editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: trimmedUrl })
        .run()
}


const CustomImage = Image.extend({
    inline() {
        return true
    },
})

export default function EntryEditor() {
    const authFetch = useAuthFetch()

    const [title, setTitle] = useState('')
    const [uploadCount, setUploadCount] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const localImageFilesRef = useRef<Map<string, File>>(new Map())

    const [coverFile, setCoverFile] = useState<File | null>(null)
    const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const isUploading = uploadCount > 0

    function insertPreviewImage(
        editor: Editor,
        file: File,
        position?: number,
    ) {
        if (!isImageFile(file)) {
            return
        }

        setError(null)

        const previewUrl = URL.createObjectURL(file)

        localImageFilesRef.current.set(previewUrl, file)

        const imageNode = {
            type: 'image',
            attrs: {
                src: previewUrl,
                alt: file.name,
            },
        }

        if (typeof position === 'number') {
            editor
                .chain()
                .focus()
                .insertContentAt(position, imageNode)
                .run()

            return
        }

        editor
            .chain()
            .focus()
            // .setImage({
            //     src: previewUrl,
            //     alt: file.name,
            // })
            .insertContent(imageNode)
            .run()
    }

    const editor = useEditor({
        immediatelyRender: false,

        editorProps: {
            handleClickOn(view, pos, node, nodePos) {
                if (node.type.name !== 'image') {
                    return false
                }

                view.dispatch(
                    view.state.tr.setSelection(
                        NodeSelection.create(view.state.doc, nodePos),
                    ),
                )

                view.focus()

                return true
            },
        },


        extensions: [
            StarterKit,

            Placeholder.configure({
                placeholder: 'Enter content',
            }),

            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),

            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                HTMLAttributes: {
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            }),

            Image.configure({
                inline: true,
                allowBase64: false,
                HTMLAttributes: {
                    class: 'entry-image',
                },
                resize: {
                    enabled: true,
                    directions: ['left', 'right'],
                    minWidth: 80,
                    minHeight: 80,
                    alwaysPreserveAspectRatio: true,
                },
            }),
            // CustomImage.configure({
            //     inline: true,
            //     allowBase64: false,
            //     HTMLAttributes: {
            //         class: 'entry-image',
            //     },
            //     resize: {
            //         enabled: true,
            //         directions: ['left', 'right'],
            //         minWidth: 80,
            //         alwaysPreserveAspectRatio: true,
            //     },
            // }),

            FileHandler.configure({
                allowedMimeTypes: [
                    'image/jpeg',
                    'image/png',
                    'image/webp',
                    'image/gif',
                ],

                onDrop: async (currentEditor, files, position) => {
                    for (const file of files) {
                        // await insertUploadedImage(currentEditor, file, position)
                        insertPreviewImage(currentEditor, file, position)
                    }
                },

                onPaste: async (currentEditor, files) => {
                    for (const file of files) {
                        // await insertUploadedImage(currentEditor, file)
                        insertPreviewImage(currentEditor, file)
                    }
                },
            }),
        ],
    })

    async function handleImageSelect(event: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files ?? [])

        if (!editor) {
            return
        }

        for (const file of files) {
            // await insertUploadedImage(editor, file)
            insertPreviewImage(editor, file)
        }

        event.target.value = ''
    }

    function handleCoverSelect(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        if (!isImageFile(file)) {
            setError('이미지 파일만 업로드할 수 있습니다.')
            return
        }

        if (coverPreviewUrl) {
            URL.revokeObjectURL(coverPreviewUrl)
        }

        const previewUrl = URL.createObjectURL(file)

        setCoverFile(file)
        setCoverPreviewUrl(previewUrl)
        setError(null)

        event.target.value = ''
    }

    function handleCoverDrop(event: React.DragEvent<HTMLLabelElement>) {
        event.preventDefault()

        const file = event.dataTransfer.files?.[0]

        if (!file) {
            return
        }

        if (!isImageFile(file)) {
            setError('이미지 파일만 업로드할 수 있습니다.')
            return
        }

        if (coverPreviewUrl) {
            URL.revokeObjectURL(coverPreviewUrl)
        }

        const previewUrl = URL.createObjectURL(file)

        setCoverFile(file)
        setCoverPreviewUrl(previewUrl)
        setError(null)
    }
    async function handleSubmit() {
        if (!editor || submitting) {
            return
        }

        const trimmedTitle = title.trim()

        if (!trimmedTitle) {
            setError('Enter title')
            return
        }

        if (editor.isEmpty) {
            setError('Enter content')
            return
        }

        try {
            setSubmitting(true)
            setError(null)

            let coverImageUrl: string | null = null

            if (coverFile) {
                coverImageUrl = await uploadImage(coverFile)
            }

            const contentHtml = await uploadLocalImagesAndReplaceHtml(editor.getHTML())

            const payload = {
                title: trimmedTitle,
                content: contentHtml,
                coverImageUrl,
            }

            const API_BASE_URL =
                process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

            const response = await authFetch(`${API_BASE_URL}/web3/api/entry/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error('게시글 등록에 실패했습니다.')
            }

            // 성공 후 필요하면 초기화
            setTitle('')
            editor.commands.clearContent()

            if (coverPreviewUrl) {
                URL.revokeObjectURL(coverPreviewUrl)
            }

            setCoverFile(null)
            setCoverPreviewUrl(null)
        } catch (error) {
            setError('게시글 등록에 실패했습니다.')
        } finally {
            setSubmitting(false)
        }
    }

    async function uploadLocalImagesAndReplaceHtml(html: string) {
        let replacedHtml = html

        for (const [previewUrl, file] of localImageFilesRef.current.entries()) {
            const uploadedUrl = await uploadImage(file)

            replacedHtml = replacedHtml.replaceAll(previewUrl, uploadedUrl)

            URL.revokeObjectURL(previewUrl)
        }

        localImageFilesRef.current.clear()

        return replacedHtml
    }


    useEffect(() => {
        return () => {
            for (const previewUrl of localImageFilesRef.current.keys()) {
                URL.revokeObjectURL(previewUrl)
            }

            localImageFilesRef.current.clear()
        }
    }, [])

    if (!editor) {
        return null
    }

    return (
        <section className={styles.editorWrapper}>
            <input
                className={styles.titleInput}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter title"
            />

            <div className={styles.coverArea}>
                {coverPreviewUrl ? (
                    <div className={styles.coverPreviewBox}>
                        <img
                            src={coverPreviewUrl}
                            alt="cover preview"
                            className={styles.coverPreview}
                        />

                        <button
                            type="button"
                            className={styles.coverRemoveButton}
                            onClick={() => {
                                URL.revokeObjectURL(coverPreviewUrl)
                                setCoverFile(null)
                                setCoverPreviewUrl(null)
                            }}
                        >
                            remove cover
                        </button>
                    </div>
                ) : (
                    <label
                        className={styles.coverUploadBox}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleCoverDrop}
                    >
                        <ImagePlus size={22} />
                        <span>add cover image</span>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            hidden
                            onChange={handleCoverSelect}
                        />
                    </label>
                )}
            </div>

            <div className={styles.toolbar}>
                <div className={styles.toolbarGroup}>
                    <ToolbarButton
                        label="undo"
                        disabled={!editor.can().chain().focus().undo().run()}
                        onClick={() => editor.chain().focus().undo().run()}
                    >
                        <Undo2 size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        label="redo"
                        disabled={!editor.can().chain().focus().redo().run()}
                        onClick={() => editor.chain().focus().redo().run()}
                    >
                        <Redo2 size={18} />
                    </ToolbarButton>
                </div>

                <span className={styles.divider} />

                <div className={styles.toolbarGroup}>
                    <ToolbarButton
                        label="bold"
                        active={editor.isActive('bold')}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                        <Bold size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        label="italic"
                        active={editor.isActive('italic')}
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                    >
                        <Italic size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        label="strike"
                        active={editor.isActive('strike')}
                        onClick={() =>
                            editor.chain().focus().toggleStrike().run()
                        }
                    >
                        <Strikethrough size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        label="inline code"
                        active={editor.isActive('code')}
                        onClick={() => editor.chain().focus().toggleCode().run()}
                    >
                        <Code2 size={18} />
                    </ToolbarButton>
                </div>

                <span className={styles.divider} />

                <div className={styles.toolbarGroup}>
                    <ToolbarButton
                        label="align left"
                        active={editor.isActive({ textAlign: 'left' })}
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    >
                        <AlignLeft size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        label="align center"
                        active={editor.isActive({ textAlign: 'center' })}
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    >
                        <AlignCenter size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        label="align right"
                        active={editor.isActive({ textAlign: 'right' })}
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    >
                        <AlignRight size={18} />
                    </ToolbarButton>
                </div>

                <span className={styles.divider} />

                <div className={styles.toolbarGroup}>
                    <ToolbarButton
                        label="sub title"
                        active={editor.isActive('heading', { level: 2 })}
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 2 })
                                .run()
                        }
                    >
                        <Heading2 size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        label="bullet list"
                        active={editor.isActive('bulletList')}
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                    >
                        <List size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        label="orderd list"
                        active={editor.isActive('orderedList')}
                        onClick={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                    >
                        <ListOrdered size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        label="blockquote"
                        active={editor.isActive('blockquote')}
                        onClick={() =>
                            editor.chain().focus().toggleBlockquote().run()
                        }
                    >
                        <Quote size={18} />
                    </ToolbarButton>
                </div>

                <span className={styles.divider} />

                <div className={styles.toolbarGroup}>
                    <ToolbarButton
                        label="add link"
                        active={editor.isActive('link')}
                        onClick={() => addLink(editor)}
                    >
                        <Link2 size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        label="remove link"
                        disabled={!editor.isActive('link')}
                        onClick={() =>
                            editor.chain().focus().unsetLink().run()
                        }
                    >
                        <Unlink size={18} />
                    </ToolbarButton>

                    <label
                        className={styles.imageUploadButton}
                        title="add image"
                        aria-label="add image"
                    >
                        <ImagePlus size={18} />

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            multiple
                            hidden
                            onChange={handleImageSelect}
                        />
                    </label>
                </div>
            </div>

            <EditorContent
                editor={editor}
                className={styles.editorContent}
            />

            <div className={styles.bottomBar}>
                <div className={styles.statusArea}>
                    {/*{isUploading && (*/}
                    {/*    <span className={styles.uploadStatus}>*/}
                    {/*        Uploading image*/}
                    {/*    </span>*/}
                    {/*)}*/}

                    {error && (
                        <span className={styles.errorMessage}>{error}</span>
                    )}
                </div>

                <button
                    type="button"
                    className={styles.submitButton}
                    // disabled={isUploading}
                    disabled={submitting}
                    onClick={handleSubmit}
                >
                    {submitting ? 'submitting...' : 'submit'}
                </button>
            </div>
        </section>
    )
}