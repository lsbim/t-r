import Footer from "@/layouts/Footer";
import HeaderNav from "@/layouts/HeaderNav";
import { raidRootContainer } from "@/styles/container";
import { TrickcalRaidEn } from "@/types/trickcalTypes";
import RaidStatsComponent from "../components/stats/RaidStatsComponent";
import StatSubNav from "../components/stats/StatSubNav";

const RaidStatsPage = ({ type }: { type: TrickcalRaidEn }) => {
    return (
        <div className={`${raidRootContainer} min-h-screen`}>
            <HeaderNav />
            <StatSubNav type={type} />
            <RaidStatsComponent type={type} />
            <Footer />
        </div>
    );
};

export default RaidStatsPage;