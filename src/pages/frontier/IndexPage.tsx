import IndexComponent from "../../components/frontier/IndexComponent";
import { useSummaryData } from "../../hooks/useSummaryData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import { FrontierSummary } from "../../types/frontierTypes";
import Loading from "../../commons/component/Loading";
import SEO from "../../commons/component/SEO";

const IndexPage = () => {

    const { data } = useSummaryData<FrontierSummary>('frontier');

    if (!data) return (<Loading />);

    // console.log(data)

    return (
        <div className="flex flex-col items-center min-h-screen">
            <SEO
                title="엘리아스 프론티어 시즌 목록, 요약"
                description="엘리아스 프론티어의 집계된 시즌 정보를 요약하여 제공합니다."
            />
            <HeaderNav />
            <IndexComponent
                summary={data}
            />
            <Footer />
        </div>
    );
}

export default IndexPage;