import express from "express";
import 'dotenv/config';
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.EVENTBUS_PORT;

//This is an inhouse event bus
const events= []
app.get("/events",(req,res)=>{
    res.send(events);
})
app.post("/events",async(req,res)=>{
    const eventData = req.body;
    //persist the event 
    events.push(req.body);
    //pass this eventData to POSTS, COMMENTS, MODERATE, and QUERIES services
    //POSTS
    await axios.post(`http://${process.env.POSTS_SERVICE_NAME}:${process.env.POSTS_PORT}/event`,eventData)
    .then((response)=>{
        console.log("Event emitted to POSTS SERVICE");
    })
    .catch((error)=>{
        console.log(error);
    });

    //COMMENTS
    await axios.post(`http://${process.env.COMMENTS_SERVICE_NAME}:${process.env.COMMENTS_PORT}/event`,eventData)
    .then((response)=>{
        console.log("Event emitted to COMMENTS SERVICE");
    })
    .catch((error)=>{
        console.log(error);
    });
    
    //QUERIES
    await axios.post(`http://${process.env.QUERIES_SERVICE_NAME}:${process.env.QUERIES_PORT}/event`,eventData)
    .then((response)=>{
        console.log("Event emitted to QUERIES SERVICE");
    })
    .catch((error)=>{
        console.log(error);
    });

    //MODERATE
    await axios.post(`http://${process.env.MODERATE_SERVICE_NAME}:${process.env.MODERATE_PORT}/event`,eventData)
    .then((response)=>{
        console.log("Event emitted to MODERATE SERVICE");
    })
    .catch((error)=>{
        console.log(error);
    });

    res.send({})
})



app.listen(PORT,()=>{console.log(`EVENTBUS SERVICE is listening on ${PORT}`)})