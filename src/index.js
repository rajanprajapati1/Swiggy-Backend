import express from "express";
import cors from "cors";
import fetch from "cross-fetch";
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

app.get("/api/restaurants", (req, res) => {
  const { lat, lng } = req.query;
  const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&page_type=DESKTOP_WEB_LISTING`;

  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      res.json(data);
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("An error occurred");
    });
});

app.get("/api/menu", (req, res) => {
  const { lat, lng, restaurantId } = req.query;
  console.log(req.query);

  /* OLD SWIGGY API
  const url = `https://www.swiggy.com/dapi/menu/v4/full?lat=${lat}&lng=${lng}&menuId=${menuId}`;
  */

  const url = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${lat}&lng=${lng}&submitAction=ENTER&restaurantId=${restaurantId}`;

  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("An error occurred");
    });
});

app.listen(port, () => {
  MongDbConnect();
  console.log(`Server is listening on port ${port}`);
});
