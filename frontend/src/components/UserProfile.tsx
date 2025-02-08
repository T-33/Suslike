import {Link, useParams} from "react-router-dom";
import NotFound from "./NotFound.tsx";
import {User} from "../types/User.ts"
import {useState, useEffect} from "react";

export default function UserProfile() {
    const {username} = useParams<{username : string}>();
    const [userProfile, setUserProfile] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
           if(!username) return;
           try {
                //TODO extract into environment variable
               const url = `http://localhost:3001/api/users/${username}`
               const response = await fetch(url);
               const data = await response.json();

               setUserProfile(data);
           } catch(error) {
               console.log("Error fetching user:", error);
           }
        }
        fetchUser();
        }, [username])



    if (userProfile == null) {
        return <NotFound/>
    }

    console.log("bg " + userProfile.background_picture_url)
    return (
        <div className="w-1/2 mx-auto flex flex-col border border-solid border-gray-200">
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
                <section>
                    <div className="max-h-1/4">
                        <img
                            className="w-full aspect-3/1 object-cover"
                            src={userProfile.background_picture_url}
                            alt="Background"
                        />
                    </div>
                    <div
                        className="flex justify-between m-2"
                    >
                        <img
                            className="w-1/4 max-h-1/3 rounded-full aspect-square border-5 border-solid border-white"
                            src={userProfile.profile_picture_url}
                            alt="Background"
                        />
                        <button
                            type="button"
                            className="mr-4 cursor-pointer inline-block self-center p-4 border-3 border-cyan-500 text-cyan-500 rounded-full"
                            onClick={()=>console.log("follow")}
                        >
                            Follow
                        </button>
                    </div>

                </section>
                <section className="flex flex-col ml-2 text-left">
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

                   {userProfile.date_of_birth}
                   {userProfile.relationship_status}
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