import IndexComponent from "../../components/frontier/IndexComponent";
import useTitle from "../../hooks/useTitle";
import { useSummaryData } from "../../hooks/useSummaryData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import { FrontierSummary } from "../../types/frontierTypes";
import Loading from "../../commons/component/Loading";

const IndexPage = () => {

    const { data } = useSummaryData<FrontierSummary>('frontier');
    useTitle("엘리아스 프론티어 시즌 목록, 요약");

    if (!data) return (<Loading />);

    // console.log(data)

    return (
        <div className="flex flex-col items-center min-h-screen">
            <HeaderNav />
            <IndexComponent
                summary={data}
            />
            <Footer />
        </div>
    );
}

export default IndexPage;