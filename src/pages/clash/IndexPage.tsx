import IndexComponent from "../../components/clash/IndexComponent";
import useTitle from "../../hooks/useTitle";
import { useSummaryData } from "../../hooks/useSummaryData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";
import { ClashSummary } from "../../types/clashTypes";
import Loading from "../../commons/component/Loading";
import { useCharSummaryData } from "../../hooks/useCharSummaryData";
import { CharacterSeasonData, CharacterSummaryData } from "../../types/commonTypes";
import { useMemo } from "react";

const IndexPage = () => {

	const { data } = useSummaryData<ClashSummary>('clash');
	const { data: chars } = useCharSummaryData<CharacterSummaryData>();
	useTitle("차원 대충돌 시즌 목록, 요약");

	// 사도별 컨텐츠 시즌별 픽률
	const clashChars = useMemo(() => {
		if (!chars) return {};

		const filtered: Record<string, CharacterSeasonData[]> = {};

		Object.entries(chars).forEach(([charName, charData]) => {
			if (charData.clash) {
				filtered[charName] = charData.clash;
			}
		})

		return filtered;
	}, [chars]);


	if (!data) {
		return (<Loading />)
	};


	// console.log(clashChars)

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