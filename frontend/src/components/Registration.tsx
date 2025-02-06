import React, {useState} from 'react';
import User from '../types/User.ts'

export default function Registration(){
    const [formData, setFormData] = useState<Partial<User>>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
}