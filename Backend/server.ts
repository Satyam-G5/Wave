import express, { Express, Request, Response } from 'express';
import cors from 'cors'
import { Server, Socket } from "socket.io";
import bodyParser from 'body-parser';
import { createServer, get } from "http";

import dotenv from 'dotenv';
 

import user_router from "./Routes/user.routes"    
import pool from './Database/postgres';
 
dotenv.config();
     
const app: Express = express(); 
const httpServer = createServer(app);
const port = process.env.PORT || 8000;

const corsOptions = { 
  origin: 'wave-ecru.vercel.app',
  methods: ['GET', 'POST'],
}; 

app.use(cors(
  corsOptions));
 
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Wave  -- Backend Server ');
});

app.use('/', user_router)

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

//  --------------------------------------------------------------  ** Sockets ** ---------------------------------------------------------

const io = new Server(httpServer, { cors: corsOptions });

// let users: { userId: any; socketId: string }[] = [];

var reciever : any ;
var sender : any ;
var sendoffer : any ;

io.on("connection", (socket: Socket) => {
  console.log("User Connected -- Socket.io ", socket.id);
 
  socket.emit("getUsers", socket.id);

  socket.on('addUser', async (phone: number, socketid: string) => {

    // console.log("Phone number received in the backend: ", phone);
    // console.log("socket id recieved in the backend: " , socketid)  

    try { 
      const addSockets: any = await pool.query(`UPDATE users SET socketID = '${socketid}' WHERE phoneno = ${phone} `);
      console.log("Executed query:", addSockets);
      console.log("Database updated. Rows affected:", addSockets.rowCount);
    } catch (error) {
      console.error('Error updating database:', error);
    }  
     
  });
// **************************************************** Call Initiation ********************************************************88
 
  socket.on("user_calling",async ({ phoneid, socketid, offer }) => {
    console.log("usercalling backend : ", phoneid, socketid, offer);

    const getid = await pool.query(`SELECT socketID FROM users WHERE phoneno = ${phoneid} `);
    const getName = await pool.query(`SELECT Firstname FROM users WHERE socketID = '${socketid}' `);
    console.log("Getid ---> : ", getid.rows);
    console.log("GetName ---> : " ,getName.rows);
    
    console.log("No of rows updated : ", getid.rowCount);
    
    const reciever_id = getid.rows[0].socketid;
    const Name = getName.rows[0].firstname;
    reciever = reciever_id ;
    sender = socketid ; 
    sendoffer = offer ;
    console.log("recieverid : " , reciever_id);

    io.to(reciever_id).emit('call_incoming' , Name);
    console.log("Incoming Call from the caller "); 
         
     
  });    
 
  //  **************************************************** Call Acceptance *******************************************************************

  socket.on("call_recived" , () => {
    console.log("incommming:call --- Recieved from callee " , sender , reciever ,sendoffer);   
    io.to(reciever).emit("incomming:call", { from: sender, sendoffer });
  })

  socket.on("call:accepted_res", ({ ans }) => {
    console.log("Call Accepted true");
    
    io.to(sender).emit("call:accepted", { from: reciever, ans }); 
    console.log("Answer send to caller : " , ans);
              
  });                
            
  
// ************************************************ Negotiation Needed **********************************************************
 
 
  socket.on("peer:nego:needed", ({ offer }) => {
    io.to(reciever).emit("peer:nego:needed", { from: sender, offer }); 
    console.log("peer:nego:needed executed success : ", offer);
  });   
 
  socket.on("peer:nego:done", ({ ans }) => {
    console.log("peer:nego:done", ans);
    io.to(sender).emit("peer:nego:final", { from: reciever, ans }); 
  });   
    
  socket.on("eventcomplete" , ()=>{    
    socket.emit("Finall_Call")       
    console.log("********** Final Call Triggered ***********");
        
  }) 
       
  // socket.on('disconnect', () => {
  //   users = users.filter(user => user.socketId !== socket.id);
  //   io.emit('getUsers', users);
  // });  
});    