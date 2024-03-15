import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config()

// const pool = new Pool({
//     host: 'localhost',
//     port: 5433,
//     database: 'talkitive',
//     user: 'postgres',
//     password: 'Satyam12'
// });

const dblocal = `postgresql://${process.env.PGLOCAL_USER}:${process.env.PGLOCAL_PASSWORD}@${process.env.PGLOCAL_HOST}:${process.env.PGLOCAL_PORT}/${process.env.PGLOCAL_DATABASE}`
const dbproduction ="postgres://aamiwuwh:Nzue7fgDpNB2XU7FtxPFd2OowHkPWGPB@floppy.db.elephantsql.com/aamiwuwh"


const pool = new Pool({
    connectionString : process.env.NODE_ENV === "production" ? dbproduction  : dblocal, 
    ssl : {
      rejectUnauthorized : false  
    }
  })

export default pool;