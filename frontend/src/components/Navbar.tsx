import {NavLink} from "react-router-dom";
import {House, Plus, Search, User, Heart} from "lucide-react";

export default function Navbar({ openModal }: { openModal: () => void }) {
    return (
            <nav  className="w-20 h-screen flex flex-col items-center justify-center  py-6">
                <ul className="flex flex-col gap-5">
                    <li>
                        <NavLink to="/">
                            <House className="nav-icon"/>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/search">
                            <Search className="nav-icon active:stroke-amber-50"/>
                        </NavLink>
                    </li>

                    <li>
                        <button onClick={openModal} >
                            <Plus className="nav-icon active:bg-gray-700"/>
                        </button>
                    </li>
                    <li>
                        <NavLink to="/favorites">
                            <Heart className="nav-icon"/>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/user">
                            <User className="nav-icon"/>
                        </NavLink>
                    </li>

                </ul>
            </nav>
    )
}