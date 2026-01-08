import Loading from "../../commons/component/Loading";
import SEO from "../../commons/component/SEO";
import ClashV2Index from "../../components/clashV2/ClashV2Index";
import { useRaidData } from "../../hooks/useRaidData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import { ClashV2Summary } from "../../types/clashV2Types";

const IndexPage = () => {

	const { data } = useRaidData<ClashV2Summary>('clashV2', 'summary');

	if (!data) {
		return (<Loading />)
	};

	// console.log(data)

	return (
		<div className="flex flex-col items-center min-h-[100.5vh]">
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