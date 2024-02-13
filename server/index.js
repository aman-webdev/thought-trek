import express from "express"
import mongoose from "mongoose"
import { config } from "dotenv"
import cors from "cors"
import userRoute from "./routes/user.routes.js"
import authRoute from "./routes/auth.routes.js"
import {ErrorMiddleware,uploadHandler} from "./middlewares/index.js"
import cookieParser from "cookie-parser"
import blogRoute from "./routes/blog.routes.js"
import commentRoute from "./routes/comment.routes.js"
import fs from "fs"
import path from "path"


config()

mongoose.connect(process.env.MONGOOSE_CONNECTION_URI).then(()=>{
    console.log('Connection Established')
}).catch(err=>console.log('Error connecting to DB ',err.message))

const app = express()
app.use(cors())

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended:true}))

app.use("/api/user",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/blog",blogRoute)
app.use("/api/comment",commentRoute)


app.listen(3000,()=>{
})

app.use(ErrorMiddleware)