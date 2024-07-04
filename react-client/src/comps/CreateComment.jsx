import axios from "axios";
import { useState } from "react";
import ListComments from "./ListComments";

export default ({ postId,comments }) => {
    const [newComment, setNewComment]=useState('');
    async function handleOnSubmit(){
        await axios.post(`${process.env.REACT_APP_COMMENTS_URL}/post/${postId}/createcomment`,{comment:newComment})
        .then((result)=>{
            setNewComment("");
            console.log("New comment on this post...");
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    return (
        <>
            <ListComments commentsArr={comments}></ListComments>
            <div className="my-3">
                <input value={newComment} onChange={(e)=> setNewComment(e.target.value)} placeholder="Post a comment.." type="text" className="form-control" id="exampleInputEmail1"/>
            </div>            
            <button onClick={handleOnSubmit} type="submit" className="btn btn-primary">Submit</button>
        </>
    );
}