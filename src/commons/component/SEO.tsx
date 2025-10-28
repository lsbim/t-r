import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    // keyword?: string;
}
const SEO: React.FC<SEOProps> = ({ title, description }) => {

    const DEFAULT_TITLE = '트릭컬 레코드';
    const DEFAULT_DESCRIPTION = '트릭컬 리바이브 차원 대충돌, 엘리아스 프론티어의 시즌 별 랭킹 집계 데이터를 제공합니다.';

    const pageTitle = title
        ? `${title} - ${DEFAULT_TITLE}`
        : DEFAULT_TITLE;

    const pageDescription = description || DEFAULT_DESCRIPTION;

    return (
        <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />

            <meta property="og:title" content={pageTitle} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="https://trickcalrecord.pages.dev/logo.png" />
            <meta property="og:url" content="https://trickcalrecord.pages.dev" />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:site_name" content={DEFAULT_TITLE} />
        </Helmet>
    );
}

export default SEO;