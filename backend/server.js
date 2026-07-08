import express from "express";

import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import dotenv from 'dotenv'
import userRouter from "./routes/userRoutes.js";
import blogRouter from "./routes/blogRoutes.js"
import commentRouter from "./routes/commentRoute.js"
import { configCloudinary } from "./config/configCloudinary.js";
import crypto from 'crypto'

const app = express();
app.use(cors());
dotenv.config()
const PORT = process.env.PORT || 3000


app.use((req, res, next) => {
 
  next();
});
app.use(express.json());
app.use('/api/v1', userRouter)
app.use('/api/v1', blogRouter)
app.use('/api/v1',commentRouter)







app.listen(PORT, async () => {
  await dbConnect();
  configCloudinary()
  
});
app.use((err, req, res, next) => {
 
 
  return res.status(500).json({
    success: false,
    message: err.message
  });
});

