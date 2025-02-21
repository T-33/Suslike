import React, {useState} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {User} from '../types/User.ts';
import {getZodiacSign} from "../../utils/zodiac.ts";
import {relationship_statuses} from "../../utils/relationship_statuses.ts";
import {useNavigate, Link} from "react-router-dom";

import angryGopher from '../images/default_avatars/gopher-angry.png';
import gopherAtPeace from '../images/default_avatars/gopher-at-peace.png';
import sleepingGopher from '../images/default_avatars/gopher-sleeping.png';
import smilingGopher from '../images/default_avatars/gopher-smiling-blushing.png';
import thinkingGopher from '../images/default_avatars/gopher-thinking.png';
import gopherWink from '../images/default_avatars/gopher-wink.png';
import defaultBanner from '../images/default_banners/default_banner.gif'

export default function Registration() {
    const [formData, setFormData] = useState<Partial<User>>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [zodiacSign, setZodiacSign] = useState<string | null>(null);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [relationshipStatus, setRelationshipStatus] = useState<string | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const defaultAvatars = [angryGopher, gopherAtPeace, sleepingGopher, smilingGopher, thinkingGopher, gopherWink];

    const [defaultAvatar] = useState(() => {
        const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
        return defaultAvatars[randomIndex];
    });

    const navigate = useNavigate();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
        }
    }

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch("http://localhost:3001/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.url) {
                return data.url;
            }
            throw new Error('Failed to upload file');
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

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
                setFormData(prev => ({...prev, date_of_birth: formatted}));
                setZodiacSign(getZodiacSign(formatted));
            }
        } else {
            setZodiacSign(null);
        }
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0];
            setFormData(prev => ({...prev, date_of_birth: formattedDate}));
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

        try {
            let profilePictureUrl = null;
            if (selectedFile) {
                profilePictureUrl = await uploadFile(selectedFile);
            }

            const preparedData: Partial<User> = {
                ...formData,
                username: formData.username.toLowerCase(),
                zodiac_sing: zodiacSign || "",
                registration_date: new Date().toISOString().split('T')[0],
                followers: 0,
                following: 0,
                profile_picture_url: profilePictureUrl || defaultAvatar,
                background_picture_url: defaultBanner,
            };

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

            localStorage.setItem('user', JSON.stringify(data.user));
            const username: string = preparedData.username as string;
            navigate(`/user/${username}`);

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-5">
            <div className="border border-gray-200 p-9 w-full max-w-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <span className="text-4xl self-center">Registration</span>
                    <div className="p-5 self-center">
                        <input
                            type="file"
                            accept="image/*"
                            id="avatar-upload"
                            className="hidden"
                            onChange={handleFileChange}
                            capture="user"
                        />
                        <label
                            htmlFor="avatar-upload"
                            className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400"
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Avatar preview"
                                     className="w-24 h-24 rounded-full object-cover"/>
                            ) : (
                                <span className="text-3xl text-gray-400">+</span>
                            )}
                        </label>
                    </div>

                    <div>
                        <input
                            type="text"
                            name="full_name"
                            placeholder="Full Name"
                            value={formData.full_name || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>

                    <div>
                        <input
                            required
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username || ''}
                            pattern="[a-zA-Z0-9_]+"
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        {usernameError && <p style={{color: 'red', fontSize: '12px'}}>{usernameError}</p>}
                    </div>

                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>

                    <div>
                        <input
                            required
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        {passwordError && <p style={{color: 'red', fontSize: '12px'}}>{passwordError}</p>}
                    </div>

                    <div>
                        <label>Birthdate: </label>
                        <DatePicker
                            selected={dateOfBirth && /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) ? new Date(dateOfBirth) : null}
                            onChange={handleDateChange}
                            customInput={<input value={dateOfBirth} onChange={handleRawDateInput}
                                                placeholder="YYYY-MM-DD"/>}
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
                        <p className="text-sm text-gray-400 ">Zodiac Sign: {zodiacSign}</p>
                    </div>

                    <div>
                        <label>Marital Status: </label>
                        <select
                            value={relationshipStatus || ""}
                            onChange={(e) => {
                                setRelationshipStatus(e.target.value);
                                setFormData(prev => ({...prev, relationship_status: e.target.value}));
                            }}
                        >
                            <option className="bg-white text-gray-600 " value="" disabled>Select your status</option>
                            {relationship_statuses.map(status => (
                                <option key={status.value} className="bg-gray-500 text-white"
                                        value={status.value}>{status.value}</option>
                            ))}
                        </select>
                    </div>


                    <button type='submit' className="mt-4 bg-amber-50 text-gray-700 p-2 border rounded-2xl cursor-pointer hover:text-black">Register</button>
                </form>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {success && <p style={{color: 'green'}}>{success}</p>}
            </div>

            <div className="flex flex-col items-center p-3.5 border border-gray-200 w-full max-w-sm">
                <p>Have an account?</p>
                <Link to="/authorization" className="text-blue-400 hover:text-blue-500">Log in</Link>
            </div>
        </div>
    )
}