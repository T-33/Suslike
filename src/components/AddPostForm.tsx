import { useState, FC, ChangeEvent, FormEvent} from "react";
import Post from "../models/Post.ts";
import '../styles/Post.css'

interface addPostProps {
    addPost: (newPost : Post) => void;
}

const initialState = {
    text: ' ',
}

const AddPostForm: FC<addPostProps> = ({addPost}) => {
    const [newPost, setNewPost] = useState<{text: string}>(initialState)

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        console.log('Handle change >>', e.target);
        setNewPost({text: e.target.value});
    }

    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const {text} = newPost;

        if(text){
            addPost({
                text,
                date: Date.now()
            })
        }


        console.log("New post", newPost.text);
        setNewPost(initialState);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                name ="post"
                type="text"
                placeholder="Write something"
                onChange={handleChange}
                value={newPost.text}
                className="w-full p-2 m-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button type="submit"> Опубликовать </button>
        </form>
    )
}

export default AddPostForm

