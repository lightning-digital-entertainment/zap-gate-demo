import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "../components/Navbar";

function Root() {
    const navigation = useNavigation()
    return (
        <div>
            <Navbar/>
            <div>
                <Outlet />
            </div>
            {navigation.state === 'loading' ? <div className="absolute inset-0 bg-red-900 opacity-50"/> : undefined}
        </div>
    );
}

export default Root;
