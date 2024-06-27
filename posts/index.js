import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4} from "uuid";
import cors from 'cors';
const PORT = 4002
const app = express();
app.use(cors())
app.use(bodyParser.json());

const postsByEmailId = {}; //{'emailId':[{id:'',post:''},{},{}]}

app.get('/users/:emailId/posts',(req,res)=>{
    res.send(postsByEmailId[req.params.emailId] || []);
})

app.post('/users/:emailId/posts',(req, res)=>{
    const postId = uuidv4();
    const {post} = req.body;
    const posts = postsByEmailId[req.params.emailId] || [];
    posts.push({id:postId,post})
    postsByEmailId[req.params.emailId] = posts;
    res.status(201).send(posts);
})

app.listen(PORT,()=>{
    console.log(`POSTS is listening on ${PORT}`)
})




