import bodyParser from "body-parser";
import 'dotenv/config'
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.QUERIES_PORT;

const queriesDatabase = {}; //{postId:{postId:'postId',post:"",status:"",comments:[{commentId:"",comment:"",status:""},{commentId:"",comment:"",status:""}]}}
app.get("/queries/getallposts",(req,res)=>{
    res.send(queriesDatabase);
})

//const eventPostCreated = {type:"PostCreated",data:{postId:"",post:"",status:""}
//const eventCommentCreated = {type:"CommentCreated", data:{commId:'',comment:"", status:"",postId:""}}
//const eventCommentUpdated = {type:"CommentUpdated",data:{commId:"",comment:"" status:"", postId:"jald"}}
function processEvent(eventData){
    const {postId,post,status,commentId,comment} = eventData.data;
    if(eventData.type==="PostCreated"){
        const postObj = {postId:postId,post:post,status:status,comments:[]}
        queriesDatabase[postId] = postObj
        console.log(`PostCreated event processed successfully!!`);   
    }
    if(eventData.type==="CommentCreated"){
        queriesDatabase[postId]["comments"].push({commentId:commentId,comment:comment,status:status});
        console.log(`CommentCreated event processed successfully!!`);
    }
    if( eventData.type==="CommentUpdated" ){
        //get the comment with this id, and post id
        const thisComm = queriesDatabase[postId]["comments"].find(comm=>{
            return comm.commentId === commentId;
        })
        thisComm.status = status;
        console.log(`CommentUpdated event processed successfully!!`);
    }
}

app.post("/event",(req,res)=>{
    //update the database with the latest data
    processEvent(req.body);    
    res.send({});
})

app.listen(PORT,()=>{
    console.log(`QUERIES SERVICE is listening on ${PORT}`)
    console.log("Syncing with event bus...");
    let syncedEvents;
    axios.get(`http://${process.env.EVENTBUS_SERVICE_NAME}:${process.env.EVENTBUS_PORT}/events`)
    .then((result)=>{
        syncedEvents = result.data;
        for(const event of syncedEvents){
            processEvent(event);
        }
        console.log("Event bus synced successfull!!");
    })
    .catch((err)=>{
        console.log(err);
    });

})