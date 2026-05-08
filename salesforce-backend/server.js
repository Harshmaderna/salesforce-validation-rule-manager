import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import router from "./routes/route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors({
  origin: [
    "https://salesforce-validation-rule-managers.vercel.app"
  ],
  credentials: true
}))

app.use(express.json()); 
app.use(cookieParser());
app.use("/api/salesforce", router);

app.get("/", (req, res) => {
  res.send("salesforce backend running"); 
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
