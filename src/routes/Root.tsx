import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "../components/Navbar";
import useNip07 from "../hooks/useNip07";

function Root() {
    const navigation = useNavigation();
    const nostrAvailable = useNip07();
    return (
        <div className={!nostrAvailable ? "overflow-hidden" : "absolute inset-0"}>
            <Navbar />
            <Outlet />
            {navigation.state === "loading" ? (
                <div className="absolute inset-0 bg-red-900 opacity-80" />
            ) : undefined}
            {!nostrAvailable ? (
                <div className="absolute inset-0 bg-black opacity-90">
                    <p>No NIP07 provider found... Get one!</p>
                </div>
            ) : undefined}
        </div>
    );
}

export default Root;
