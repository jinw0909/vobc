'use client';

import {ComponentProps} from "react";
import { Link } from "@/i18n/navigation";
import { useSelectedLayoutSegments} from "next/navigation";
import styles from './styles.module.css';
import {LinkProps} from "next/link";

interface NavigationLinkProps extends ComponentProps<typeof Link> {
    pseudo ? : string
}

export const NavigationLink = ({
    href,
    ...rest
} : NavigationLinkProps)  => {
    const selectedLayoutSegment = useSelectedLayoutSegments().pop();
    const pathName = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/';
    const isActive = pathName === href;
    const {pseudo, ...remaining} = rest;
    const isPseudo = pseudo == "true";
    return (
        <Link
            aria-current = { isActive ? 'page' : undefined }
            href={href}
            className={`${isActive ? styles.isActive : ''} ${isPseudo ? styles.pseudo : ''} ${styles.linkBtn}`}
            {...rest}
        />
    )
}