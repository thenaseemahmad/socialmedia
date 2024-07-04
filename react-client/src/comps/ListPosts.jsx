import axios from "axios";
import { useEffect, useState } from "react";
import CreateComment from "./CreateComment";

export default () => {
    const [posts, setPosts] = useState([]);

    async function getAllPosts() {
        await axios.get(`${process.env.REACT_APP_GET_POSTS_URL}/queries/getallposts`)
            .then((result) => {
                const postsArr = Object.keys(result.data).map((key) => result.data[key])
                setPosts(postsArr);
            })
            .catch((err) => {
                console.log("Error while getting list of posts");
            })

    };

    useEffect(() => {
        //use axios to get the list of all posts
        getAllPosts();
    }, [])

    return (
        posts.map((p) => {
            return(
            <div key={p.postId} className="card mb-3">
                <div className="card-header">
                    Naseem ahmad
                </div>
                <div className="card-body">
                    <h5 className="card-title">{p.post}</h5>
                    <CreateComment comments={p.comments} postId={p.postId}></CreateComment>
                </div>
            </div>
            );
        })
    );
}