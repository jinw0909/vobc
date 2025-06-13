// import {createSharedPathnamesNavigation} from "next-intl/navigation";
import { createNavigation } from "next-intl/navigation";

export const locales = ['en', 'jp', 'cn'] as const;
export const localePrefix = 'always'; //Default

export const {Link, redirect, usePathname, useRouter } =
    // createSharedPathnamesNavigation({locales, localePrefix});
    createNavigation({locales, localePrefix});

