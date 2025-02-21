import {Link, useParams} from "react-router-dom";
import NotFound from "./NotFound.tsx";
import {User} from "../types/User.ts";
import {useState, useEffect} from "react";
import API_ROOT from "../../api-root.tsx"

export default function UserProfile() {
    const {username} = useParams<{username : string}>();
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [errorFetchingUser, setErrorFetchingUser] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
           if(!username) return;
           try {
               const url = `${API_ROOT}/api/users/${username}`
               const response = await fetch(url);

               if(response.ok) {
                   const data = await response.json();
                   setUserProfile(data);
               } else {
                   setErrorFetchingUser(true);
               }
           } catch(error) {
               console.log("Error fetching user:", error);
               setErrorFetchingUser(true);
           }
        }
        fetchUser();
        }, [username])

    if (userProfile == null || errorFetchingUser) {
        return <NotFound/>
    }

    return (
        <div className="w-1/2 h-full mx-auto flex flex-col py-8 border border-solid rounded-3xl border-gray-200">
            <header className="flex">
                <button
                    type="button"
                    className="m-4 cursor-pointer"
                    onClick={()=>console.log("click")}
                >
                    Go Back
                </button>
                <h1 className="mx-4 font-bold text-4xl">{userProfile.username}</h1>
            </header>
            <main>
                <section className="relative">
                    <img
                        className="max-h-1/4 w-full aspect-3/1 object-cover"
                        src={userProfile.background_picture_url}
                        alt="Background"
                    />
                    <img
                        className="absolute left-[15%] bottom-[calc(-10%)] height-auto -translate-x-1/2 w-1/4 rounded-full aspect-square border-5 border-solid border-gray-300"
                        src={userProfile.profile_picture_url}
                        alt="Background"
                        style={{imageRendering: "pixelated"}}
                    />
                    <div className="flex justify-end m-2">
                        <button
                            type="button"
                            className="inline-flex justify-center items-center mr-4 aspect-4/1 text-center cursor-pointer p-4 border-3 border-cyan-500 text-white rounded-full"
                            onClick={()=>console.log("follow")}
                        >
                            Follow
                        </button>
                    </div>
                </section>
                <section className="flex flex-col ml-2 mt-7 text-left">
                    <div className="flex flex-col self-start">
                        <div className="font-bold text-4xl">
                            {userProfile.full_name}
                        </div>
                        <div className="text-gray-500 ">
                            <Link to={`/user/${username}`}>@{userProfile.username}</Link>
                        </div>
                    </div>

                    <p className="mt-2">
                        {userProfile.description}
                    </p>
                    <span>
                        {userProfile.date_of_birth}
                    </span>
                    {" "}
                    <span>
                        {userProfile.relationship_status}
                    </span>
                    <p>
                        <span>
                            <span className="font-bold">
                                {userProfile.followers}
                            </span>
                            {" "}
                            Followers
                        </span>
                        {" "}
                        <span>
                            <span className="font-bold">
                                {userProfile.following}
                            </span>
                            {" "}
                            Following
                        </span>
                    </p>
                </section>
            </main>
        </div>
    )
}