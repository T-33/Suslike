import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';

export default function Authorization() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Login failed.');
            }

            localStorage.setItem('user', JSON.stringify(data.user));
            navigate(`/user/${username}`);

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    }

    return (
        <div className="auth-block flex flex-col justify-center items-center gap-5">
            <div className="border border-gray-200 p-9 w-full max-w-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                    <span className="text-3xl self-center mb-6">Authorization</span>

                    <div>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={event => setUsername(event.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <button type="submit"
                            className="my-4 bg-amber-50 text-gray-700 p-2 border rounded-2xl cursor-pointer hover:text-black">
                        Log in
                    </button>

                    <Link to="/reset-password" className="self-center text-sm text-blue-300 hover:text-blue-600">Forgot the password?</Link>
                </form>
            </div>

            <div className="flex flex-col items-center p-3.5 border border-gray-200 w-full max-w-sm">
                <p>No account yet?</p>
                <Link to="/register" className="text-blue-400 hover:text-blue-500">Register</Link>
            </div>
        </div>
    )
}
