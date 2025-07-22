import mongoose from "mongoose";
import colors from 'colors'
const connectdb=async() =>{
    try {
        const conn= await mongoose.connect(process.env.MONGO_URL);
  console.log(`Connected to MongoDB Database: ${conn.connection.host}`.bgGreen.white);        
    } catch (error) {
        console.log(`error in Mongodb Database ${error}`.bgRed.white);
        
    }
}
export default connectdb;

