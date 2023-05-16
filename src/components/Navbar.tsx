import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import logo from "../assets/logo.svg";

function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="flex flex-row justify-between px-4 py-8 border-b-2 border-zinc-700 items-center">
            <Link to={"/"} className="flex">
                <img src={logo} className="w-24 sm:w-48"/>
            </Link>
            <div>
                <a
                    href="https://github.com/Egge7/nips/blob/zapGates/XX.md"
                    className="mr-4"
                >
                    Spec
                </a>
                <Button
                    text="Try it!"
                    onClick={() => {
                        navigate("upload");
                    }}
                />
            </div>
        </nav>
    );
}

export default Navbar;
