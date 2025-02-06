import React, {useState} from 'react';
import User from '../types/User.ts'

export default function Registration(){
    const [formData, setFormData] = useState<Partial<User>>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [name, value] = event.target;
        setFormData({
            ...formData,
            [name]: value});
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        try{
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({formData})
            })

            if(!response.ok){
                const data = await response.json();
                throw new Error(data.error || 'Something went wrong');
            }

            const data = await response.json();
            setSuccess("User successfully registered");
            console.log("Successfully registered" + data);
        } catch (error) {
            setError(error.message);
        }
    };

    return (

    )
}