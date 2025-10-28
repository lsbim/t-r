import Loading from "../../commons/component/Loading";
import SEO from "../../commons/component/SEO";
import IndexComponent from "../../components/home/IndexComponent";
import NoticeComponent from "../../components/home/NoticeComponent";
import { useNonData } from "../../hooks/useNonData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";

const IndexPage = () => {

    const { data, isLoading, error } = useNonData();

    // console.log(data)

    if (!data) {
        <Loading />
    }

    return (
        <div className="flex flex-col justify-center gap-4 min-h-[100.5vh]" > {/* 스크롤을 위한 100.5vh */}
            <SEO />
            <HeaderNav />
            <IndexComponent />
            <NoticeComponent
                data={data}
            />
            <Footer />
        </div >
    );
}

export default IndexPage;