import {User} from "../../types/User.ts";

export default function readUserCookie(): User | null {
    const userCookie = localStorage.getItem("user");

    if (userCookie == null) {
        return null;
    }
    return JSON.parse(userCookie) as User;
}
