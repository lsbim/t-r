import SEO from "../../../../components/SEO";
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
			<SEO
				title="차원 대충돌 2.0 시즌 목록, 요약"
				description="차원 대충돌 2.0의 집계된 시즌 정보를 요약하여 제공합니다."
			/>
			<HeaderNav />
			<ClashV2Index
				summary={data}
			/>
			<Footer />
		</div>
	);
}

export default IndexPage;