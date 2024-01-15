import express from "express";
import axios from "axios";
import pg from "pg";
import bodyParser from "body-parser";

//start app?
const app = express();
//server port?
const port = process.env.PORT || 3000;
//body-parser?
app.use(bodyParser.urlencoded({ extended: true }));
//pg login info and server port

//app.get?
app.get("/", (req, res) => {
  res.render("index.ejs")
})

//server listening
app.listen(port, () => {
  console.log(`Server is listening on ${port}`)
})
