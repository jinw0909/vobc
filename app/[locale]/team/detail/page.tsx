import {setRequestLocale} from "next-intl/server";

export default async function Page({params} : any) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div>detail</div>
    )
}