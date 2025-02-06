import React, {useState} from "react";

export default function ResetPassword(){
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async (event : React.FormEvent) => {
        event.preventDefault();

        const response = await fetch("http://localhost:3001/reset-password", {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({})
        })

        const data = await response.json();
        setMessage(data.message)
    }

    return(
        <h1>
            You forgot your password.
        </h1>
    )
}