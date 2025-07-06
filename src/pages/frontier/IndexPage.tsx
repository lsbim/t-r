import IndexComponent from "../../components/frontier/IndexComponent";
import { useSummaryData } from "../../hooks/useSummaryData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import { FrontierSummary } from "../../types/frontierTypes";

const IndexPage = () => {

    const { data } = useSummaryData<FrontierSummary>('frontier');

    if (!data) return;

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