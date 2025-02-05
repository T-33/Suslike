import {useParams} from "react-router-dom";
import NotFound from "./NotFound.tsx";
import {User} from "../types/User.ts"
import {useState, useEffect} from "react";

export default function UserProfile() {
    const {userId} = useParams<{userId : string}>();
    const [userProfile, setUserProfile] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
           if(!userId) return;
           try {
               const response = await fetch(`/mock-json/user${userId}.json`);
               const data = await response.json();
               setUserProfile(data);
           } catch(error) {
               console.log("Error fetching user:", error);
           }
        }

        fetchUser();
        }, [userId])
    console.log(userProfile)
    if (userProfile == null) {
        return <NotFound/>
    }

    return (
        <>
            <h1>{userProfile.full_name}</h1>
            <h1>{userProfile.username}</h1>
            <h1>{userProfile.email}</h1>
            <h1>{userProfile.date_of_birth}</h1>
            <h1>{userProfile.password}</h1>
            <h1>{userProfile.profile_picture_url}</h1>
            <h1>{userProfile.relationship_status}</h1>
            <h1>{userProfile.followers}</h1>
            <h1>{userProfile.following}</h1>
            <h1>{userProfile.user_id}</h1>
        </>
    )
}