import Loading from "../../commons/component/Loading";
import SEO from "../../commons/component/SEO";
import IndexComponent from "../../components/clash/IndexComponent";
import { useRaidData } from "../../hooks/useRaidData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import { ClashSummary } from "../../types/clashTypes";

const IndexPage = () => {

	const { data } = useRaidData<ClashSummary>('clash', 'summary');

	if (!data) {
		return (<Loading />)
	};

	return (
		<div className="flex flex-col items-center min-h-screen">
			<SEO
				title="차원 대충돌 시즌 목록, 요약"
				description="차원 대충돌의 집계된 시즌 정보를 요약하여 제공합니다."
			/>
			<HeaderNav />
			<IndexComponent
				summary={data}
			/>
			<Footer />
		</div>
	);
}

export default IndexPage;