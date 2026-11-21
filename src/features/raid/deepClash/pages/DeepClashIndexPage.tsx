import { useRaidData } from "../../../../hooks/useRaidData";
import Footer from "../../../../layouts/Footer";
import HeaderNav from "../../../../layouts/HeaderNav";
import { raidRootContainer } from "../../../../styles/container";
import { DeepClashSummary } from "../../../../types/deepClashTypes";
import Summary from "../../shared/components/Summary";

const DeepClashIndexPage = () => {
    const { data } = useRaidData<DeepClashSummary>('deepClash', 'summary');

    return (
        <div className={`${raidRootContainer} min-h-[100.5vh]`}>
            <HeaderNav />
            <main className="w-[992px] max-w-full my-8 mx-auto">
                <div className="p-2 mb-2">
                    <h1 className="text-[20px] font-bold dark:text-zinc-200">
                        심해 대격돌 집계
                    </h1>
                </div>
                <Summary summary={data} type="deepClash" />
            </main>
            <Footer />
        </div>
    );
};

export default DeepClashIndexPage;