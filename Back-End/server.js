const express = require("express");
const router = require("./src/routes");
const cors = require("cors");

require("dotenv").config();

const app = express();



const portServer = process.env.PORT || 8000;

//body parser
app.use(express.json());

app.use(cors());

//routes group
app.use("/api/v1", router);
app.get("/", (req, res) => {
    res.send("testing")
});
app.use("/uploadedImages", express.static("uploadedImages"));

app.listen(portServer, () => console.log(`your server is running at port : ${portServer}`));

//root url = localhost:3000/api/v1