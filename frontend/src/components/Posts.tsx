import {useEffect, useState} from "react";
import {Post} from "../types/Post.ts"
import {Link} from "react-router-dom";
import {User} from "../types/User.ts";
import AddPost from "./AddPost.tsx";
import API_ROOT from "../../api-root.tsx"


export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<{[key: number]: User}>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
    const openAddPostModal = () => setIsAddPostModalOpen(true);
    const closeAddPostModal = () => setIsAddPostModalOpen(false);

    useEffect(() => {
        fetch(`${API_ROOT}/posts`)
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);

                const userIds = [...new Set(data.map((post: Post) => post.user_id))];

                return Promise.all(
                    userIds.map(userId =>
                        fetch(`${API_ROOT}/api/users/id/${userId}`)
                            .then(res => res.json())
                    )
                );

            })
            .then(usersData => {
                const usersMap = usersData.reduce((acc, user) => {
                    acc[user.user_id] = user;
                    return acc;
                }, {});
                setUsers(usersMap);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setError("Failed to load posts.");
                setLoading(false);
            })
    }, []);

    if(loading) return <img src="../gifs/running_gopher.gif" alt="running-gopher-gif"/>
    if(error) return <p className="text-red-500">{error}</p>;


    return (
        <div className="container max-w-2xl mx-auto ">
            <div className="flex justify-between items-center align-middle mb-4 gap-3 border border-gray-400 rounded-lg p-3"
                 onClick={openAddPostModal} >
                <input
                    placeholder="What's new?"
                    className="w-xl p-2 rounded focus:outline-none"
                    readOnly/>
                <button type='submit' className="text-white w-30 p-2 border border-gray-500 rounded-2xl cursor-pointer hover:text-black">Post</button>
            </div>

            <AddPost isOpen={isAddPostModalOpen} onClose={closeAddPostModal} />

            {posts.map((post, index) => {
                const user = users[post.user_id];
                const isFirstPost = index === 0;
                const isLastPost = index === posts.length - 1;
                const isOnlyPost = posts.length === 1;

                return (
                    <div
                        key={post.post_id}
                        className={`p-4 border border-gray-400 ${
                            isOnlyPost
                                ? "rounded-lg"
                                : `${isFirstPost ? "rounded-t-lg" : ""} ${
                                    isLastPost ? "rounded-b-lg border-b" : "border-b-0"
                                }`
                        }`}
                    >
                        <Link
                            to={`/user/${user?.username}`}
                            className="inline-flex items-center justify-center text-white"
                        >
                            <img
                                src={user?.profile_picture_url}
                                alt={`${user?.username}'s avatar`}
                                className="w-10 h-10 rounded-full mr-3 object-cover cursor-pointer"
                            />
                            <span className="text-gray-400">@{user?.username}</span>
                        </Link>

                        {post.imageUrl && (
                            <img
                                src={post.imageUrl}
                                alt="Post"
                                className="w-full h-60 object-cover rounded-lg"
                            />
                        )}
                        <p className="mt-2">{post.text}</p>
                        <p className="text-sm text-gray-500">Likes: {post.likes}</p>
                    </div>
                );
            })}
        </div>
    )
}