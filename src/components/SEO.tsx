import { TrickcalRaidEn } from "@/types/trickcalTypes";
import { translateRaid } from "@/utils/function";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

interface SEOProps {
    title?: string;
    description?: string;
    // keyword?: string;
    noindex?: boolean;
}
const SEO: React.FC<SEOProps> = ({
    title,
    description,
    noindex = false,
}) => {

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
            {noindex && <meta name="robots" content="noindex, nofollow" />}
        </Helmet>
    );
}

export default SEO;

// useSuspenseQuery 사용하는 페이지 전용 ----------------

export const RaidIndexSEO = ({ raidType }: { raidType: TrickcalRaidEn }) => {
    const raidName = translateRaid(raidType);

    return (
        <SEO
            title={`${raidName} 시즌 목록, 요약`}
            description={`${raidName}의 집계된 시즌 정보를 요약하여 제공합니다.`}
        />
    );
};

export const RaidSeasonSEO = ({ raidType }: { raidType: TrickcalRaidEn }) => {
    const { season } = useParams();
    const raidName = translateRaid(raidType);
    const seasonName = Number(season) >= 10000 ? `베타 시즌${Number(season) - 10000}` : `시즌${season}`;

    return (
        <SEO
            title={`${raidName} ${seasonName} 집계`}
            description={`${raidName} ${seasonName}의 랭킹 집계 데이터를 제공합니다.`}
        />
    );
};

export const CharacterSEO = () => {
    const { charName } = useParams() as { charName: string };
    return (
        <SEO
            title={`${charName} - 사도 정보, 통계`}
            description={`트릭컬 리바이브 ${charName}의 컨텐츠 기록을 요약하여 제공합니다.`}
        />
    );
};