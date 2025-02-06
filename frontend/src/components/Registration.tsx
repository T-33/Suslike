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
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

        if (numbers.length >= 5) {
            const year = numbers.slice(0, 4);
            let month = numbers.slice(4, 6);
            let day = numbers.slice(6, 8);

            if (month.length === 1 && parseInt(month) > 1) {
                month = `0${month}`;
            }

            const monthNum = parseInt(month);
            if (monthNum < 1 || monthNum > 12) {
                month = month.slice(0, 1);
            }

            const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            const dayNum = parseInt(day);
            const maxDaysInMonth = daysInMonth[monthNum - 1];

            if (dayNum > maxDaysInMonth) {
                day = day.slice(0, 1);
            }

            return `${year}${month ? `-${month}` : ''}${day ? `-${day}` : ''}`;
        }
        return numbers;
    };

    const handleRawDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\D/g, '');
        const formatted = formatDateInput(input);

        e.target.value = formatted;
        setDateOfBirth(formatted);

        if (/^\d{4}-\d{2}-\d{2}$/.test(formatted)) {
            const date = new Date(formatted);
            if (!isNaN(date.getTime())) {
                setFormData(prev => ({ ...prev, date_of_birth: formatted }));
                setZodiacSign(getZodiacSign(formatted));
            }
        } else {
            setZodiacSign(null);
        }
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0];
            setFormData(prev => ({ ...prev, date_of_birth: formattedDate }));
            setZodiacSign(getZodiacSign(formattedDate));
            setDateOfBirth(formattedDate);
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
            registrationDate: new Date().toISOString().split('T')[0],
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
            <h1 className="text-4xl my-3">Registration</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        id="avatar-upload"
                        className="hidden"
                        // onChange={handleFileChange}
                        capture="user"
                    />
                    <label
                        htmlFor="avatar-upload"
                        className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400"
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar preview" className="w-24 h-24 rounded-full object-cover" />
                        ) : (
                            <span className="text-3xl text-gray-400">+</span>
                        )}
                    </label>
                </div>

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
                        selected={dateOfBirth && /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) ? new Date(dateOfBirth) : null}
                        onChange={handleDateChange}
                        customInput={<input value={dateOfBirth} onChange={handleRawDateInput} placeholder="YYYY-MM-DD" />}
                        onChangeRaw={(e) => {
                            if (!e || !(e.target instanceof HTMLInputElement)) return;
                            handleRawDateInput(e as unknown as React.ChangeEvent<HTMLInputElement>);
                        }}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="YYYY-MM-DD"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        maxDate={new Date()}
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

                <button type='submit'>Register</button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && <p style={{color: 'green'}}>{success}</p>}
        </div>
    )
}