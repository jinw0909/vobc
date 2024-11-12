import {setRequestLocale, unstable_setRequestLocale} from "next-intl/server";

export default function Page({params : { locale }} : {params : {locale : string}}) {

    setRequestLocale(locale);

    return (
        <div>detail</div>
    )
}