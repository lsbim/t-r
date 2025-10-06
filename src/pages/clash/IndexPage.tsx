import IndexComponent from "../../components/clash/IndexComponent";
import useTitle from "../../hooks/useTitle";
import { useSummaryData } from "../../hooks/useSummaryData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import { ClashSummary } from "../../types/clashTypes";
import Loading from "../../commons/component/Loading";

const IndexPage = () => {

	const { data } = useSummaryData<ClashSummary>('clash');
	useTitle("차원 대충돌 시즌 목록, 요약");

	if (!data) {
		return (<Loading />)
	};

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