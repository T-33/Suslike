import '../styles/Authorization.css'

import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Authorization() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });

            const data = await response.json();
            if(!response.ok){
                throw new Error(data.error || 'Login failed.');
            }

            localStorage.setItem('user', JSON.stringify(data.user));
            navigate(`/user/${username}`);

        } catch (error){
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    }

    return (
        <div className="auth-block">
            <h1 className={"text-5xl my-5"}>SUSlike</h1>
            <h2 className={"text-3xl my-3.5"}>Authorization</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <label htmlFor="username">Username: </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={event => setUsername(event.target.value)}
                            required
                            className={"border"}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password: </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            required
                            className={"border"}
                        />
                    </div>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className={"my-3"}>Log in</button>
            </form>
            <Link to="/reset-password">Forgot the password?</Link>
        </div>
    )
}
