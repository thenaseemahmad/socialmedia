import express from "express";
import 'dotenv/config'
import bodyParser from "body-parser";
import { v4 as uuidv4} from "uuid";
import cors from 'cors';
import axios from "axios";

const app = express();
app.use(cors())
app.use(bodyParser.json());
const PORT = process.env.POSTS_PORT;

const posts = {}; //{postId: {postId:postId, post:"", status:""}}

app.get('/posts',(req,res)=>{
    res.send(posts);
})

//req.body = {post:""}
app.post('/posts',async (req, res)=>{
    const postId = uuidv4();
    const {post} = req.body;
    const postObj = {postId:postId, post:post, status:"awaiting"}
    posts[postId] = postObj
    //Emit an event to Event bus
    await axios.post(`http://${process.env.EVENTBUS_SERVICE_NAME}:${process.env.EVENTBUS_PORT}/events`,{type:"PostCreated",data:postObj})
    .then((response)=>{
        console.log("PostCreated event has been emitted to EventBus..")
    })
    .catch((error)=>{
        console.log(error)
    });
    res.status(201).send(posts);
})

//listens to the event from event bus
app.post('/event',(req,res)=>{
    //DO nothing on any event
    res.send({});
})

app.listen(PORT,()=>{
    console.log(`POSTS is listening on ${PORT}`)
})




