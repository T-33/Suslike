import {Outlet} from "react-router-dom";
import Navbar from "./Navbar.tsx";

export default function Layout({ openModal }: { openModal: () => void }){
    return(
        <div className="flex h-screen">
            <Navbar openModal={openModal}/>
            <main className="flex-1 p-4 overflow-auto">
                <Outlet/>
            </main>

        </div>
    )
}
