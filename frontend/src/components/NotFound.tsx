import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import gopherDead from "../images/gopher-dead.png";
import gopherConfused from "../images/gopher-confused.png";
import gopherCrying from "../images/gopher-crying-river.png";
import '../styles/index.css'

const images = [gopherDead, gopherConfused, gopherCrying]

export default function NotFound() {
    const [randomImage, setRandomImage] = useState("");
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * images.length);
        setRandomImage(images[randomIndex]);
    }, [])


    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-6xl font-bold text-white-800">404</h1>
            <p className="text-xl text-gray-600 mt-4">Page not found</p>
            {randomImage && (
                <img
                    src={randomImage}
                    alt="Not Found"
                    className="my-6 w-40 md:w-80 scale-100"
                    style={{imageRendering: "pixelated"}}
                />
            )}
            <Link to="/" className="border p-2 rounded-xl">
                Go Home
            </Link>
        </div>
    )
}