import IndexComponent from "../../components/home/IndexComponent";
import NoticeComponent from "../../components/home/NoticeComponent";
import { useNonData } from "../../hooks/useNonData";
import Footer from "../../layouts/Footer";
import HeaderNav from "../../layouts/HeaderNav";

const IndexPage = () => {

    const { data, isLoading, error } = useNonData();

    // console.log(data)

    if(!data){
        <div className="flex flex-col justify-center gap-4 min-h-screen">
            <HeaderNav />
        </div>
    }

    return (
        <div className="flex flex-col justify-center gap-4 min-h-screen">
            <HeaderNav />
            <IndexComponent />
            <NoticeComponent
                data={data}
            />
            <Footer />
        </div>
    );
}

export default IndexPage;