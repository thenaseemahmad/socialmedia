import express from "express";
import 'dotenv/config';
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.MODERATE_PORT;

async function processEvent(type,data){
    if(type==="CommentCreated"){
        const status = data.comment.includes('orange')?'rejected':'approved';
        await axios.post(`http://${process.env.EVENTBUS_SERVICE_NAME}:${process.env.EVENTBUS_PORT}/events`,{
            type:'CommentModerated',
            data:{
                commentId:data.commentId,
                postId:data.postId,
                comment:data.comment,
                status:status
            }
        })
        .then((response)=>{
            console.log("CommentCreated event processed successfully and send for Moderation!!");
        })
        .catch((error)=>{
            console.log(error);
        });
    }
}
app.post("/event",async(req,res)=>{
    const {type, data} = req.body;
    processEvent(type,data);
    res.send({})
});

app.listen(PORT,()=>{
    console.log(`MODERATE SERVICE is listening on ${PORT}`);
    console.log("Syncing with event bus..");
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
});