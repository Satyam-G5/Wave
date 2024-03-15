"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./Routes/user.routes"));
const postgres_1 = __importDefault(require("./Database/postgres"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const port = process.env.PORT || 8000;
const corsOptions = {
    origin: 'wave-ecru.vercel.app',
    methods: ['GET', 'POST'],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Wave  -- Backend Server ');
});
app.use('/', user_routes_1.default);
httpServer.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
//  --------------------------------------------------------------  ** Sockets ** ---------------------------------------------------------
const io = new socket_io_1.Server(httpServer, { cors: corsOptions });
// let users: { userId: any; socketId: string }[] = [];
var reciever;
var sender;
var sendoffer;
io.on("connection", (socket) => {
    console.log("User Connected -- Socket.io ", socket.id);
    socket.emit("getUsers", socket.id);
    socket.on('addUser', (phone, socketid) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log("Phone number received in the backend: ", phone);
        // console.log("socket id recieved in the backend: " , socketid)  
        try {
            const addSockets = yield postgres_1.default.query(`UPDATE users SET socketID = '${socketid}' WHERE phoneno = ${phone} `);
            console.log("Executed query:", addSockets);
            console.log("Database updated. Rows affected:", addSockets.rowCount);
        }
        catch (error) {
            console.error('Error updating database:', error);
        }
    }));
    // **************************************************** Call Initiation ********************************************************88
    socket.on("user_calling", ({ phoneid, socketid, offer }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("usercalling backend : ", phoneid, socketid, offer);
        const getid = yield postgres_1.default.query(`SELECT socketID FROM users WHERE phoneno = ${phoneid} `);
        const getName = yield postgres_1.default.query(`SELECT Firstname FROM users WHERE socketID = '${socketid}' `);
        console.log("Getid ---> : ", getid.rows);
        console.log("GetName ---> : ", getName.rows);
        console.log("No of rows updated : ", getid.rowCount);
        const reciever_id = getid.rows[0].socketid;
        const Name = getName.rows[0].firstname;
        reciever = reciever_id;
        sender = socketid;
        sendoffer = offer;
        console.log("recieverid : ", reciever_id);
        io.to(reciever_id).emit('call_incoming', Name);
        console.log("Incoming Call from the caller ");
    }));
    //  **************************************************** Call Acceptance *******************************************************************
    socket.on("call_recived", () => {
        console.log("incommming:call --- Recieved from callee ", sender, reciever, sendoffer);
        io.to(reciever).emit("incomming:call", { from: sender, sendoffer });
    });
    socket.on("call:accepted_res", ({ ans }) => {
        console.log("Call Accepted true");
        io.to(sender).emit("call:accepted", { from: reciever, ans });
        console.log("Answer send to caller : ", ans);
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
    socket.on("eventcomplete", () => {
        socket.emit("Finall_Call");
        console.log("********** Final Call Triggered ***********");
    });
    // socket.on('disconnect', () => {
    //   users = users.filter(user => user.socketId !== socket.id);
    //   io.emit('getUsers', users);
    // });  
});
