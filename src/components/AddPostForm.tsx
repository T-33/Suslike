import { useState, FC, ChangeEvent, FormEvent} from "react";
import Post from "../models/Post.ts";
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
            <input
                type="text"
                name ="text"
                placeholder="Write something..."
                onChange={handleChange}
                value={newPost.text}
                className="w-full p-2 m-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input type="file"
                   name="imageUrl"
                   accept="image/*"
                   onChange={handleChange}
                   className="border p-2 rounded-2xl"
            />
            {newPost.imageUrl && (
                <img
                    src={newPost.imageUrl}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg"
                />
            )}
            <button type="submit"> Опубликовать </button>
        </form>
    )
}

export default AddPostForm

