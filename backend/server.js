import express from "express";

import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import dotenv from 'dotenv'
import userRouter from "./routes/userRoutes.js";
import blogRouter from "./routes/blogRoutes.js"
import commentRouter from "./routes/commentRoute.js"
import { configCloudinary } from "./config/configCloudinary.js";
import crypto from 'crypto'
// console.log('key' ,crypto.randomBytes(6).toString('hex'));
const app = express();
app.use(cors());
dotenv.config()
const PORT = process.env.PORT || 3000
// console.log(PORT);

app.use((req, res, next) => {
  // console.log("Request received:", req.method, req.url);
  next();
});
app.use(express.json());
app.use('/api/v1', userRouter)
app.use('/api/v1', blogRouter)
app.use('/api/v1',commentRouter)







app.listen(PORT, async () => {
  await dbConnect();
  configCloudinary()
  console.log("Server started on port 3000 ...");
});
app.use((err, req, res, next) => {
  console.log("final erro bhai");
  console.log(err);
  return res.status(500).json({
    success: false,
    message: err.message
  });
});

