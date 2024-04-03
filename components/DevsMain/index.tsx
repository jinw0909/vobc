import Image from "next/image";
import techPic from "@/public/devs_technology.png";
import styles from "./styles.module.css"
// import Link from "next/link";
import {NavigationLink} from "@/ui/NavigationLink";
import {getTranslations} from "next-intl/server";
export const DevsMain = async ({lang} : {lang :string}) => {

    // const t = getTranslations('devsmain');

    return (
        <div className={styles.devsWrapper}>
            <div className={`flex-1 flex justify-center items-center`}>
                <Image
                    src={techPic}
                    width={200}
                    height={200}
                    quality={100}
                    alt="devs image for the main page"
                    className={styles.imgElem}
                />
            </div>
            <div className={`${styles.textElem} flex-1`}>
                <div className="text-4xl mb-4">Technology</div>
                <div className="text-xl mb-4">Security Architecture</div>
                <div className={`${styles.textStyle} mb-4`}>
                    GOYABOT is an advanced automated computer program. It operates with minimal human intervention efficiently increasing user engagement. We are commited to leveraging technology and the VOB token to construct a resilient ecosystem ensuring stable token economy and profit-generative prospects.
                </div>
                <NavigationLink href="/devs">
                    <button className={styles.checkoutBtn}>View More</button>
                </NavigationLink>
            </div>
        </div>
    )
}