import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "../components/Navbar";

function Root() {
    const navigation = useNavigation();
    return (
        <div>
            <Navbar />
            <Outlet />
            {navigation.state === "loading" ? (
                <div className="absolute inset-0 bg-red-900 opacity-80" />
            ) : undefined}
        </div>
    );
}

export default Root;
