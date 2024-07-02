import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.COMMENTS_PORT;


const commentsByPostId = {} //{postId:[{commentId:commentId, comment:'',status:"awaiting"}],{}}
app.get('/posts/:postId/comments',(req,res)=>{
    res.send(commentsByPostId[req.params.postId]);
});

// req.body = 
app.post('/posts/:postId/comments',(req,res)=>{ 
    const commentId = uuidv4();
    const {comment} = req.body;
    const comments = commentsByPostId[req.params.postId] || [];    
    const commentObj = {postId:req.params.postId,commentId:commentId,comment:comment,status:"awaiting"};
    comments.push(commentObj);
    commentsByPostId[req.params.postId] = comments;
    axios.post(`http://${process.env.EVENTBUS_SERVICE_NAME}:${process.env.EVENTBUS_PORT}/events`,{type:"CommentCreated",data:commentObj})
    .then((result)=>{
        console.log("Comment created event has been emitted to event-bus!!")
    })
    res.status(201).send(commentsByPostId[req.params.postId]);
});

function processEvent(eventType, eventData){
    //only listens for CommentModerated type event
    if(eventType==="CommentModerated"){
        const {postId, commentId,status} = eventData;
        //persist this data
        const thisComment = commentsByPostId[postId].find(comm=>{
            return comm.commentId = commentId;
        })
        thisComment.status = status;
        axios.post(`http://${process.env.EVENTBUS_SERVICE_NAME}:${process.env.EVENTBUS_PORT}/events`,{type:"CommentUpdated",data:thisComment})
    }
}
//listens from the event bus
app.post("/event",(req,res)=>{ 
    const {type,data} = req.body;
    processEvent(type,data);
    res.send({});
});

app.listen(PORT,()=>{
    console.log(`COMMENTS SERVICE is listening on ${PORT}`);
    //sync with the event
    //get all the events and process it
    console.log("Syncing with event bus..")
    let events;
    axios.get(`http://${process.env.EVENTBUS_SERVICE_NAME}:${process.env.EVENTBUS_PORT}/events`)
    .then((result)=>{
        events = result.data;
        for( const event of events){
            processEvent(event.type, event.data);
        }
        console.log("Event bus synced successfull!!");
    })
    .catch((err)=>{
        console.log(err);
    });
})