import {useState} from 'react';
import { useForm } from "react-hook-form";

interface FormData {
    password: string;
    confirmPassword: string;
}

export default function ForgotPassword() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {register, handleSubmit, watch, formState: {errors}} = useForm<FormData>();
    const password = watch("password");

    const validatePassword = (value: string) => {
        const hasUpperCase = /[A-ZА-Я]/.test(value);
        const hasLowerCase = /[a-zа-я]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (!hasUpperCase) return "Password must contain an uppercase letter";
        if (!hasLowerCase) return "Password must contain a lowercase letter";
        if (!hasNumber) return "Password must contain a number";
        if (!hasSpecialChar) return "Password must contain a special character";

        return true;
    };

    const onSubmit = async () => {
            setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
            <div>
                <label className="block text-sm font-medium mb-2">New password</label>
                <input
                    type="password"
                    {...register("password", {
                        required: "Enter password",
                        minLength: {value: 8, message: "At least 8 characters"},
                        validate: validatePassword
                    })}
                    className="border p-2 w-full rounded"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Confirm password</label>
                <input
                    type="password"
                    {...register("confirmPassword", {
                        required: "Confirm password",
                        validate: (value) => value === password || "Passwords don't match",
                    })}
                    className="border p-2 w-full rounded"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition disabled:opacity-50"
            >
                {isSubmitting ? "Saving..." : "Save"}
            </button>
        </form>
    );
}
