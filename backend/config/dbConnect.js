
import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()
async function dbConnect() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`);  

        // console.log("Database is connected successfully");  
    } catch (error) {
        throw new Error(error)
        // console.log("error occurred", error.message);
    }
}
export default dbConnect