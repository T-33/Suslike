import React, {useState} from "react";

export default function ResetPassword() {
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async (event: React.FormEvent) => {
        event.preventDefault();


        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        const response = await fetch("http://localhost:3001/reset-password", {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({username, newPassword})
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

                <div>
                    <label htmlFor="confirmPassword">Confirm Password: </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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