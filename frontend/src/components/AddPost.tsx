import React, {useState} from "react";
import {Navigate} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";

import API_ROOT from "../../api-root.tsx"

import {Post} from "../types/Post.ts";
import {User} from "../types/User.ts";

import readUserCookie from "./utils/readUserCookie.tsx"

import {ImagePlus} from 'lucide-react';

export default function AddPost({isOpen, onClose}: { isOpen: boolean; onClose: () => void }) {
    const [post, setPost] = useState<Partial<Post>>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [userProfile] = useState<User | null>(readUserCookie());

    if (userProfile == null) {
        return <Navigate to="/authorization" replace/>
    }

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
            const response = await fetch(`${API_ROOT}/posts-upload`, {
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
        const {name, value} = e.target;
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
                user_id: userProfile.user_id,
                creation_date: new Date().toISOString(),
                likes: 0,
                imageUrl: imageUrl as string,
            };

            const response = await fetch(`${API_ROOT}/posts`, {
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
            setTimeout(onClose, 1000);
        } catch (error) {
            console.error(error);
            setError("An error occurred while creating the post.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        initial={{ opacity: 0.23 }}
                        animate={{ opacity: 0.2 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        onClick={onClose}
                    >
                        <motion.div
                            className="bg-gray p-6 rounded-2xl shadow-lg w-96 relative"
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.8, opacity: 0}}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                    onClick={onClose}>
                                ✖
                            </button>

                            <h1 className="text-center text-5xl"><b className="text-red-500">SUS</b>like</h1>
                            <form onSubmit={handleSubmit} className="post-form max-w-2xl mx-auto">

                                <div>
                                <textarea
                                    name="text"
                                    placeholder="Write something..."
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            const form = e.currentTarget.closest('form');
                                            if (form) {
                                                form.requestSubmit();
                                            }
                                        }
                                    }}
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
                                        <ImagePlus
                                            size={20}
                                            stroke="#ffffff"
                                            className="hover:stroke-blue-500 transition-colors"
                                        />
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
                                        post
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}


