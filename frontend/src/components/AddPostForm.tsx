import { useState, FC, ChangeEvent, FormEvent} from "react";
import Post from "../types/Post.ts";
import '../styles/Post.css'

interface addPostProps {
    addPost: (newPost : Post) => void;
}

interface PostState {
    text: string;
    imageUrl?: string;
}

const initialState: PostState = {
    text: ' '
}

const AddPostForm: FC<addPostProps> = ({addPost}) => {
    const [newPost, setNewPost] = useState<PostState>(initialState)

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        const {name, value, type} = e.target

        if(type === 'file'){
            const file = e.target.files?.[0];

            if(file){
                const imageUrl = URL.createObjectURL(file);
                setNewPost((prev) => ({
                    ...prev,
                    imageUrl
                }))
            }
        }
        else{
            setNewPost((prev) => ({
                ...prev,
                [name] : value}
            ));
        }

        console.log('Handle change >>', e.target);
    }

    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(newPost.text){
            addPost({
                text: newPost.text,
                date: Date.now(),
                ...(newPost.imageUrl && { imageUrl: newPost.imageUrl })
            })
        }

        console.log("New post", newPost.text);
        setNewPost(initialState);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    name ="text"
                    placeholder="Write something..."
                    onChange={handleChange}
                    value={newPost.text}
                    className="w-full p-2 mt-5 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="inline-flex cursor-pointer hover:border-white">
                <label>
                    <input type="file"
                           name="imageUrl"
                           accept="image/*"
                           onChange={handleChange}
                           className="hidden"
                    />
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 11C8.10457 11 9 10.1046 9 9C9 7.89543 8.10457 7 7 7C5.89543 7 5 7.89543 5 9C5 10.1046 5.89543 11 7 11Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5.56055 21C11.1305 11.1 15.7605 9.35991 21.0005 15.7899" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.28 3H5C3.93913 3 2.92172 3.42136 2.17157 4.17151C1.42142 4.92165 1 5.93913 1 7V17C1 18.0609 1.42142 19.0782 2.17157 19.8284C2.92172 20.5785 3.93913 21 5 21H17C18.0609 21 19.0783 20.5785 19.8284 19.8284C20.5786 19.0782 21 18.0609 21 17V12" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.75 8.82996V0.829956" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15.5508 4.02996L18.7508 0.829956L21.9508 4.02996" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </label>
                {newPost.imageUrl && (
                    <img
                        src={newPost.imageUrl}
                        alt="Preview"
                        className="w-40 h-40 object-cover rounded-lg"
                    />
                )}
            </div>

            <div className="text-center">
                <button type="submit"> Опубликовать </button>
            </div>

        </form>
    )
}

export default AddPostForm

