import { useRaidData } from "../../../../hooks/useRaidData";
import Footer from "../../../../layouts/Footer";
import HeaderNav from "../../../../layouts/HeaderNav";
import { raidRootContainer } from "../../../../styles/container";
import { ClashSummary } from "../../../../types/clashTypes";
import IndexComponent from "../components/IndexComponent";

const IndexPage = () => {

	const { data } = useRaidData<ClashSummary>('clash', 'summary');

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