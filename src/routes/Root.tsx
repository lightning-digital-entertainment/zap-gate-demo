import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "../components/Navbar";
import useNip07 from "../hooks/useNip07";
import Button from "../components/Button";
import { useState } from "react";

function Root() {
    const navigation = useNavigation();
    const nostrAvailable = useNip07();
    const [showBlock, setShowBlock] = useState(!nostrAvailable)
    return (
        <div
            className={
                !nostrAvailable
                    ? "overflow-hidden absolute inset-0"
                    : "absolute inset-0"
            }
        >
            <Navbar />
            <Outlet />
            {navigation.state === "loading" ? (
                <div className="absolute inset-0 bg-red-900 opacity-80" />
            ) : undefined}
            {showBlock ? (
                <div className="absolute inset-0 bg-black opacity-90 flex justify-center items-center">
                    <div className="p-4 bg-zinc-800 rounded items-center flex flex-col justify-center">
                        <p>No NIP07 provider found...</p>
                        <p className="mb-4">
                            Get one at{" "}
                            <a
                                href="https://getalby.com"
                                className="text-current-500"
                            >
                                getalby.com
                            </a>
                        </p>
                        <Button text="Open Anyways!" onClick={() => {setShowBlock(false)}}/>
                    </div>
                </div>
            ) : undefined}
        </div>
    );
}

export default Root;
