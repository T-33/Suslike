import React, {useState} from 'react';
import {User} from '../types/User.ts';
import {getZodiacSign} from "../../utils/zodiac.ts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Registration() {
    const [formData, setFormData] = useState<Partial<User>>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [zodiacSign, setZodiacSign] = useState<string | null>(null);
    const [dateInput, setDateInput] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;

        if (name === "username") {
            const regex = /^[a-zA-Z0-9_]*$/;
            if (!regex.test(value)) {
                setUsernameError("Only English letters, numbers, and underscores are allowed");
                return;
            } else {
                setUsernameError(null);
            }
        }

        if (name === "password") {
            if (value.length < 6) {
                setPasswordError('Password must be at least 6 characters long');
            } else {
                setPasswordError(null)
            }
        }

        setFormData({
            ...formData,
            [name]: value
        });
    }

    const formatDateInput = (input: string) => {
        const numbers = input.replace(/\D/g, '');
        if (numbers.length <= 4) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
        return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
    };

    const handleRawDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const formatted = formatDateInput(input);
        setDateInput(formatted);

        if (/^\d{4}-\d{2}-\d{2}$/.test(formatted)) {
            const date = new Date(formatted);
            if (!isNaN(date.getTime())) {
                setFormData(prev => ({ ...prev, date_of_birth: formatted }));
                setZodiacSign(getZodiacSign(formatted));
            }
        }
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0];
            setFormData(prev => ({ ...prev, date_of_birth: formattedDate }));
            setZodiacSign(getZodiacSign(formattedDate));
            setDateInput(formattedDate);
        }
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!formData.username || !formData.password) {
            setError('Username and password are required');
            return;
        }

        const preparedData = {
            ...formData,
            username: formData.username.toLowerCase(),
            zodiacSign: zodiacSign || "",
            registrationDate: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(preparedData),
            });

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
                        required
                        type="text"
                        name="username"
                        value={formData.username || ''}
                        pattern="[a-zA-Z0-9_]+"
                        onChange={handleInputChange}/>
                    {usernameError && <p style={{color: 'red', fontSize: '12px'}}>{usernameError}</p>}
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
                    <label>Birthdate: </label>
                    <DatePicker
                        selected={formData.date_of_birth ? new Date(formData.date_of_birth) : null}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="YYYY-MM-DD"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        value={dateInput}
                        customInput={<input value={dateInput} onChange={handleRawDateInput} placeholder="YYYY-MM-DD" />}
                        onChangeRaw={(e) => {
                            handleRawDateInput(e as unknown as React.ChangeEvent<HTMLInputElement>);
                        }}
                    />

                </div>

                <div>
                    <label>Zodiac Sign: {zodiacSign}</label>
                </div>

                <div>
                    <label>Password: </label>
                    <input
                        required
                        type="password"
                        name="password"
                        value={formData.password || ''}
                        onChange={handleInputChange}/>
                    {passwordError && <p style={{color: 'red', fontSize: '12px'}}>{passwordError}</p>}
                </div>

                <button type='submit' disabled={!!error}>Register</button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && <p style={{color: 'green'}}>{success}</p>}
        </div>
    )
}