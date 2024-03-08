const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const multer = require('multer') // Middleware For Handling Images & File - Read the Documentation

// Import all the Routes
const authRoute=require('./routes/auth')
const userRoute=require('./routes/users')
const postRoute = require('./routes/posts')
const commentRoute=require('./routes/comments')


// MIDDLEWARES
dotenv.config();
app.use(express.json())
app.use(cookieParser())
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
// Middleare for Image Upload using Multer
const storage = multer.diskStorage({
    destination:(req,file,fxn) => {
        fxn(null, "images")
    },
    filename:(req,file,fxn)=>{
        fxn(null,req.body.img)
        // fxn(null,"image1.png")
    }
})
const upload = multer({storage:storage})
// Defining Route for Uploading Image
app.post("/api/upload",upload.single("file"),(req,res)=>{
    res.status(200).json("Image has been Uploaded Successfully.")
})


// Connect Routes with App
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)



// Database connection
const connectDB = async()=> {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database is Connected successfully");
    }
    catch(err){
        console.error(err);
    }
}




const PORT = process.env.PORT

app.listen(PORT, ()=> {
    connectDB();
    console.log(`App is Running on Port ${PORT}`);
})