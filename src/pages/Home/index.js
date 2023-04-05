import HeaderHomePage from "~/components/Layouts/HeaderHomePage";
import Sidebar from "~/components/Layouts/Sidebar";

function Home({children}) {
    return ( 
        <div>
            <HeaderHomePage />
            <div>
                <Sidebar />
                <div>{children}</div>
            </div>
        </div>
    );
}

export default Home;