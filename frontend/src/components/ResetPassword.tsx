import React, {useState} from "react";
import {Link} from "react-router-dom";
import API_ROOT from "../../api-root.tsx";

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

        const response = await fetch(`${API_ROOT}/reset-password`, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({username, newPassword})
        })

        const data = await response.json();
        setMessage(data.message)
    }

    return (
        <div className="flex flex-col justify-center items-center gap-5">
            <div className="border border-gray-200 p-9 w-full max-w-sm">
                <form onSubmit={handleResetPassword} className="flex flex-col gap-2">
                    <h1 className="text-3xl mb-5 self-center">Reset Password</h1>
                    <div>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>

                    </div>
                    <div>
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>

                    </div>

                    <div>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>

                    </div>
                    <button type='submit'
                            className="mt-4 bg-amber-50 text-gray-700 p-2 border rounded-2xl cursor-pointer hover:text-black">Reset
                        password
                    </button>
                </form>
                {message && <p>{message}</p>}
            </div>

            <p>OR</p>

            <div className="flex flex-col items-center p-3.5 border border-gray-200 w-full max-w-sm">
                <p>No account?</p>
                <Link to="/register" className="text-blue-400 hover:text-blue-500">Create new account</Link>
            </div>
        </div>
    );
}