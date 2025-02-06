import React, {useState} from 'react';
import {User} from '../types/User.ts'

export default function Registration() {
    const [formData, setFormData] = useState<Partial<User>>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json();
            if (!response.ok) {

                throw new Error(data.error || 'Something went wrong');
            }
            setSuccess("User successfully registered");
            console.log("Successfully registered" + data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <div>
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Full Name: </label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name || ''}
                        onChange={handleInputChange}/>
                </div>

                <div>
                    <label>Username: </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username || ''}
                        onChange={handleInputChange}/>
                </div>

                <div>
                    <label>E-mail</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}/>
                </div>

                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password || ''}
                        onChange={handleInputChange}/>
                </div>

                <button type='submit'>Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    )
}