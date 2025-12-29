// Spring API 응답 타입(필요한 것만)
type SpringArticle = {
    id: number;
    title: string;
    content: string;
    summary?: string | null;
    author?: string | null;
    description?: string | null;
    thumbnail?: string | null;
    link?: string | null;
    publisherName?: string | null;
    publisherIntroduction?: string | null;
    releaseDate?: string | null; // 있으면 사용, 없으면 null
    category?: any;              // 필요 없으면 제거
};

// NewsAcc가 기존에 받던 JSON 형태(너가 올린 스키마)
export type NewsItem = {
    id: string;          // 기존: "2025102001" 같은 string
    date: string;        // "October 20, 2025" 같은 포맷
    author: string;
    title: string;
    subtitle: string;
    content: string;
    desc: string;
    press: string;
    pressdesc: string;
    link: string;
    type: string;
};

// 날짜 포맷(있으면 쓰고, 없으면 빈 값)
function formatDate(d?: string | null) {
    if (!d) return "";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return d; // 이미 포맷된 문자열이면 그대로
    return dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" });
}

// ✅ 핵심: Spring -> NewsAcc 스키마로 변환
export function mapSpringToNewsItem(a: SpringArticle): NewsItem {
    return {
        id: String(a.id), // number -> string
        date: formatDate(a.releaseDate), // 없으면 ""
        author: a.author ?? "",
        title: a.title ?? "",
        subtitle: a.summary ?? "",              // summary를 subtitle로 매칭
        content: a.content ?? "",               // HTML 그대로
        desc: a.description ?? "",              // 없으면 ""
        press: a.publisherName ?? "",           // publisherName -> press
        pressdesc: a.publisherIntroduction ?? "",// publisherIntroduction -> pressdesc
        link: a.link ?? "",
        type: "editorial", // 없으니 기본값(원하면 category로 매핑 가능)
    };
}
