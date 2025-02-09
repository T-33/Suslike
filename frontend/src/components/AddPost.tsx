import React, {useState} from "react";
import {Post} from "../types/Post.ts";
import '../styles/Post.css'

export default function AddPost() {
    const [post, setPost] = useState<Partial<Post>>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
        }
    };

    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch("http://localhost:3001/posts-upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.url) {
                return data.url;
            }
            throw new Error('Failed to upload file');
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            let imageUrl = null;
            if (selectedFile) {
                imageUrl = await uploadFile(selectedFile) as string;
            }

            if (!post.text && !imageUrl) {
                setError("Please add either text or an image to create a post");
                return;
            }

            const preparedData: Partial<Post> = {
                ...post,
                user_id: 123465, // TODO написать логику для пользователя
                creation_date: new Date().toISOString(),
                likes: 0,
                imageUrl: imageUrl as string,
            };

            const response = await fetch("http://localhost:3001/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(preparedData),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            setSuccess("Post created successfully!");
            setPost({});
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error(error);
            setError("An error occurred while creating the post.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="ms-120 post-form max-w-2xl ">
            <div>
                <textarea
                    name="text"
                    placeholder="Write something..."
                    onChange={handleInputChange}
                    value={post.text || ""}
                    className="w-full p-2 mt-5 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="inline-flex cursor-pointer hover:border-white">
                <label>
                    <input
                        type="file"
                        name="imageUrl"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7 11C8.10457 11 9 10.1046 9 9C9 7.89543 8.10457 7 7 7C5.89543 7 5 7.89543 5 9C5 10.1046 5.89543 11 7 11Z"
                            stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.56055 21C11.1305 11.1 15.7605 9.35991 21.0005 15.7899" stroke="#ffffff"
                              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path
                            d="M12.28 3H5C3.93913 3 2.92172 3.42136 2.17157 4.17151C1.42142 4.92165 1 5.93913 1 7V17C1 18.0609 1.42142 19.0782 2.17157 19.8284C2.92172 20.5785 3.93913 21 5 21H17C18.0609 21 19.0783 20.5785 19.8284 19.8284C20.5786 19.0782 21 18.0609 21 17V12"
                            stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.75 8.82996V0.829956" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"
                              strokeLinejoin="round"/>
                        <path d="M15.5508 4.02996L18.7508 0.829956L21.9508 4.02996" stroke="#ffffff" strokeWidth="1.5"
                              strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </label>
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-40 h-40 object-cover rounded-lg ml-4"
                    />
                )}
            </div>

            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}

            <div className="text-center mt-4">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Опубликовать
                </button>
            </div>
        </form>
    )
}
