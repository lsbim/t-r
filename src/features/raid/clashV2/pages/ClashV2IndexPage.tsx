import { useRaidData } from "../../../../hooks/useRaidData";
import Footer from "../../../../layouts/Footer";
import HeaderNav from "../../../../layouts/HeaderNav";
import { raidRootContainer } from "../../../../styles/container";
import { ClashV2Summary } from "../../../../types/clashV2Types";
import ClashV2Index from "../components/ClashV2Index";

const IndexPage = () => {

	const { data } = useRaidData<ClashV2Summary>('clashV2', 'summary');

	return (
		<div className={`${raidRootContainer} min-h-[100.5vh]`}>
			<HeaderNav />
			<ClashV2Index
				summary={data}
			/>
			<Footer />
		</div>
	);
}

export default IndexPage;