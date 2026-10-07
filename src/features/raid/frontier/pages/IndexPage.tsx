import { useRaidData } from "../../../../hooks/useRaidData";
import Footer from "../../../../layouts/Footer";
import HeaderNav from "../../../../layouts/HeaderNav";
import { raidRootContainer } from "../../../../styles/container";
import { FrontierSummary } from "../../../../types/frontierTypes";
import IndexComponent from "../components/IndexComponent";

const IndexPage = () => {

    const { data } = useRaidData<FrontierSummary>('frontier', 'summary');

    return (
        <div className={`${raidRootContainer} min-h-screen`}>
            <HeaderNav />
            <IndexComponent
                summary={data}
            />
            <Footer />
        </div>
    );
}

export default IndexPage;