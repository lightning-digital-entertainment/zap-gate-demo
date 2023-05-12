import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function Root() {
    return (
        <div>
            <Navbar/>
            <div>
                <Outlet />
            </div>
        </div>
    );
}

export default Root;
