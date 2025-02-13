import {NavLink} from "react-router-dom";
import {House, Plus, Search, User, Heart} from "lucide-react";
import type {User as UserType} from "../types/User.ts"
import {useEffect, useState} from "react";
import readUserCookie from "./utils/readUserCookie.tsx";

export default function Navbar({ openModal }: { openModal: () => void }) {
    const [currentUser, setCurrentUser] = useState<UserType | null>(readUserCookie())
    const [myProfileUrl, setMyProfileUrl] = useState("/authorization")

    useEffect(() => {
        const userCookieUpdateInterval = setInterval(()=> {
            setCurrentUser(readUserCookie())
            if(currentUser != null) {
                setMyProfileUrl(`/user/${currentUser.username}`)
            } else {
                setMyProfileUrl(`/authorization`)
            }
        }, 1000)

        return () => clearInterval(userCookieUpdateInterval)
    }, [currentUser])

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
                        <NavLink to={myProfileUrl}>
                            <User className="nav-icon"/>
                        </NavLink>
                    </li>

                </ul>
            </nav>
    )
}