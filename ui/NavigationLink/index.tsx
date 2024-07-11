'use client';

import {ComponentProps} from "react";
import { Link } from "@/navigation";
import { useSelectedLayoutSegments} from "next/navigation";
import styles from './styles.module.css';
import {LinkProps} from "next/link";

interface NavigationLinkProps extends ComponentProps<typeof Link> {
    showPseudo ? : boolean
}

export const NavigationLink = ({
    href,
    ...rest
} : NavigationLinkProps)  => {
    const selectedLayoutSegment = useSelectedLayoutSegments().pop();
    const pathName = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/';
    const isActive = pathName === href;
    const { showPseudo = false, ...remains } = rest;
    return (
        <Link
            aria-current = { isActive ? 'page' : undefined }
            href={href}
            className={`${isActive ? styles.isActive : ''} ${showPseudo ? styles.pseudo : ''} ${styles.linkBtn}`}
            {...rest}
        />
    )
}