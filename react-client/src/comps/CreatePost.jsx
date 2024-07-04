import axios from "axios";
import { useState } from "react";

export default () => {
    const [newpost, setNewpost] = useState("");
    function handleSubmit() {
        axios.post(`${process.env.REACT_APP_POSTS_URL}/posts/create`, { post: newpost })
            .then((result) => {
                console.log("New post created successfully!!");
                setNewpost("");
            })
            .catch((err) => { console.log(`Error occured while posting a post: ${err}`) });
    }

    return (
        <>
            <h3>New Post</h3>
            <div className="mb-3">
                <input value={newpost} onChange={(e) => { setNewpost(e.target.value) }} placeholder="New post title/detail here" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>
            <button onClick={handleSubmit} type="submit" className="btn btn-primary">Submit</button>
        </>
    );
}