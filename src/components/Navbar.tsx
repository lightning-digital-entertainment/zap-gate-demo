import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";
import logo from "../assets/logo.svg";

import {FaEnvelope, FaGithub} from 'react-icons/fa'

function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="flex flex-row justify-between px-4 py-8 border-b-2 border-zinc-700 items-center">
            <Link to={"/"} className="flex">
                <img src={logo} className="w-24" />
            </Link>
            <div className="flex flex-row items-center">
                <a
                    href="https://github.com/Egge7/nips/blob/zapGates/60.md"
                    className="mr-4 text-xl text-white"
                >
                    <FaGithub/>
                </a>
                <NavLink
                    to={'contact'}
                    className="mr-4 text-xl text-white"
                >
                    <FaEnvelope/>
                </NavLink>
                <Button
                    text="+ New Post"
                    onClick={() => {
                        navigate("upload");
                    }}
                />
            </div>
        </nav>
    );
}

export default Navbar;
