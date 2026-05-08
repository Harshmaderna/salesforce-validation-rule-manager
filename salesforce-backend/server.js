import dotenv from "dotenv";
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

import router from "./routes/route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors({
  origin: [ 
    "http://localhost:5173" 
  ],
  credentials: true
}))
app.use(cookieParser());
app.use(express.json()); 
app.use("/api/salesforce", router);

app.get("/", (req, res) => {
  res.send("salesforce backend running"); 
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
