import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import MongDbConnect from './config/MongDb.config.js'
import SwiggyRoute from './routes/SwiggyRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import cookieParser from 'cookie-parser'
dotenv.config();

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials : true ,
    methods : ["GET","POST","PUT","DELETE"]
  })
);

app.use(`${process.env.API}/swiggy`,SwiggyRoute)
app.use(`${process.env.API}/auth`,AuthRoute)



app.listen(port, () => {
  MongDbConnect();
  console.log(`Server is listening on port ${port}`);
});
