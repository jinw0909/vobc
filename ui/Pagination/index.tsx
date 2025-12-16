import styles from "@/components/BlogTag/styles.module.css";
import {NavigationLink} from "@/ui/NavigationLink";


type PaginationProps = {
    totalPages: number;
    currentPage: number;
    basePath: string;
    size?: number;
}

export default function Pagination({
    totalPages,
    currentPage,
    basePath,
    size
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const makeHref = (p: number) => {
        const qs = new URLSearchParams();
        qs.set("page", String(p));
        if (size) qs.set("size", String(size));
        return `${basePath}?${qs.toString()}`;
    };

    return (
        <div className={styles.pagination}>
            {currentPage > 1 && (
                <NavigationLink href={makeHref(currentPage - 1)} className={styles.pageLink}>
                    ‹ Prev
                </NavigationLink>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <NavigationLink
                    key={p}
                    href={makeHref(p)}
                    className={`${styles.pageLink} ${p === currentPage ? styles.activePage : ""}`}
                >
                    {p}
                </NavigationLink>
            ))}

            {currentPage < totalPages && (
                <NavigationLink href={makeHref(currentPage + 1)} className={styles.pageLink}>
                    Next ›
                </NavigationLink>
            )}
        </div>
    );
}