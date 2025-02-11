import {useEffect, useState} from "react";
import {Post} from "../types/Post.ts"
import {Link} from "react-router-dom";
import {User} from "../types/User.ts";
import Default_Avatar from '../../../data/user_avatars/default.png'

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<{[key: number]: User}>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:3001/posts")
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);

                const userIds = [...new Set(data.map((post: Post) => post.user_id))];

                return Promise.all(
                    userIds.map(userId =>
                        fetch(`http://localhost:3001/api/users/id/${userId}`)
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
            {posts.map((post) => {
                const user = users[post.user_id];
                return(
                <div key={post.post_id} className="p-4 mb-4 border border-gray-400 rounded-lg">
                    <Link to={`/user/${user?.username}`} className="inline-flex items-center justify-center text-white">
                        <img
                            src={user?.profile_picture_url || Default_Avatar}
                            alt={`${user?.username}'s avatar`}
                            className="w-10 h-10 rounded-full mr-3 object-cover cursor-pointer"
                        />
                        <span className="text-gray-400">@{user?.username}</span>
                    </Link>

                    {post.imageUrl && (
                        <img src={post.imageUrl} alt="Post" className="w-full h-60 object-cover rounded-lg"/>
                    )}
                    <p className="mt-2">{post.text}</p>
                    <p className="text-sm text-gray-500">Likes: {post.likes}</p>
                </div>
    )
            })}
        </div>
    )
}