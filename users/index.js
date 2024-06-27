import express from "express";
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 4001


const users = {} //{"emailId":{fName:''}}
app.post('/users',(req,res)=>{
    const userId = uuidv4();
    const {fName, emailId} = req.body;
    users[emailId]={userId, emailId, fName}
    res.status(201).send(users[emailId]);
})

app.get('/users',(req,res)=>{
    res.send(users)
})

app.listen(PORT,()=>{
    console.log(`users service is listening on ${PORT}`)
})