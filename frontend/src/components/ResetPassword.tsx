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

    return (
        <div className="auth-block">
            <h1 className="text-3xl my-5">Reset Password</h1>
            <form onSubmit={handleResetPassword}>
                <div>
                    <label htmlFor="username">Username: </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="border"
                    />
                </div>
                <div>
                    <label htmlFor="newPassword">New Password: </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="border"
                    />
                </div>
                <button type="submit" className="my-3">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}