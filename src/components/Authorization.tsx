import '../styles/Authorization.css'

import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function Authorization() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(username === "aisha" && password === "qwerty"){
            navigate("/user")
        } else{
            setError("Incorrect username or password");
        }
    }

    return (
        <div className="auth-block">
            <h1 className={"text-5xl my-5"}>
                Suslik
            </h1>
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
        </div>
    )
}
