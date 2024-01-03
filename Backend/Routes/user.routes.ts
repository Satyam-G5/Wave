import express , { Express , Request , Response } from "express";
import {addusers , loguser , getuser , getalluser} from '../Controllers/user.controllers'

const router = express.Router()

router.post("/add_user" , addusers );  // Registering the user 

router.post("/log_user" , loguser );   // Loggin the user

router.get("/get_user" , getuser);  // User details 

router.get("/all_user" , getalluser);  // all users in database 

export default router ;  


// adduser token is -> "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTg0MTYxMTh9.S_gVxmcvvvSEuOyH_LlfTWoxUeoO7ekSomCclXH98Jk"
// Log_user token is -> "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTg0MTYxODl9.T3Xt5Z7xXdum7h1XQ5CmMV4siLqr5ZFsic1ndOfJyIY"