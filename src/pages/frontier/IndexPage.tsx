import IndexComponent from "../../components/frontier/IndexComponent";
import { useSummaryData } from "../../hooks/useSummaryData";
import HeaderNav from "../../layouts/HeaderNav";
import { FrontierSummary } from "../../types/frontierTypes";

const IndexPage = () => {

    const { data } = useSummaryData<FrontierSummary>('frontier');

    if (!data) return;

    // console.log(data)

    return (
        <div className="flex flex-col items-center">
            <HeaderNav />
            <IndexComponent
                summary={data}
            />
        </div>
    );
}

export default IndexPage;