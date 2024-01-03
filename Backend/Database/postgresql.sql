CREATE DATABASE Talkitive ;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY ,
    Firstname VARCHAR (300) ,
    LastName VARCHAR (300) ,
    Email VARCHAR(500),
    phoneNo INT ,
    socketID VARCHAR(500),
    password VARCHAR(400)
);