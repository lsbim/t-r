import Loading from "../../commons/component/Loading";
import SEO from "../../commons/component/SEO";
import IndexComponent from "../../components/home/IndexComponent";
import NoticeComponent from "../../components/home/NoticeComponent";
import { useNonData } from "../../hooks/useNonData";
import { useSummaryData } from "../../hooks/useSummaryData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import { LatestData } from "../../types/latestTypes";

const IndexPage = () => {

    const { data, isLoading, error } = useNonData();
    const { data: latest } = useSummaryData<LatestData>('latest');

    // console.log(latest)

    if (!data || !latest) {
        return (<Loading />);
    }

    return (
        <div className="flex flex-col justify-center gap-4 min-h-[100.5vh]" > {/* 스크롤을 위한 100.5vh */}
            <SEO />
            <HeaderNav />
            <IndexComponent
                latest={latest}
            />
            <NoticeComponent
                data={data}
            />
            <Footer />
        </div >
    );
}

export default IndexPage;