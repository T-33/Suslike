import { useState } from 'react'
import './styles/App.css'
import AddPostForm from "./components/AddPostForm.tsx";
import Post from "./types/Post.ts";

function App() {
  const [postsList, setPostsList] = useState<Post[]>([]);

  const addPost = (newPost: Post) => {
      setPostsList([...postsList, newPost]);
  }
    console.log('PostList>>>', postsList)

  return (
    <>
        <p className= "text-4xl">Как прошел ваш день?</p>
        <AddPostForm
            addPost={addPost}
        />
    </>
  )
}

export default App
