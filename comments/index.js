import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 4003
const commentsByPostId = {} //{postId:[{id:'', comment:''},{}]}
app.get('/posts/:postId/comments',(req,res)=>{
    res.send(commentsByPostId[req.params.postId])

})

app.post('/posts/:postId/comments',(req,res)=>{
    const commentId = uuidv4();
    const comments = commentsByPostId[req.params.postId] || [];
    const {comment} = req.body;
    comments.push({id:commentId,comment})
    commentsByPostId[req.params.postId] = comments;
    res.status(201).send(comments);
})

app.listen(PORT,()=>{console.log(`COMMENTS is listening on ${PORT}`);})