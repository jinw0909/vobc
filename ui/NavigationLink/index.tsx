'use client';

import {ComponentProps} from "react";
import { Link } from "@/navigation";
import { useSelectedLayoutSegments} from "next/navigation";
import styles from './styles.module.css';

export const NavigationLink = ({
    href,
    ...rest
} : ComponentProps<typeof Link>)  => {
    const selectedLayoutSegment = useSelectedLayoutSegments().pop();
    const pathName = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/';
    const isActive = pathName === href;
    return (
        <Link
            aria-current = { isActive ? 'page' : undefined }
            href={href}
            className={`${isActive ? styles.isActive : ''} ${styles.linkBtn}`}
            {...rest}
        />
    )
}