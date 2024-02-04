import express from "express"
import mongoose from "mongoose"
import { config } from "dotenv"
import cors from "cors"
import userRoute from "./routes/user.routes.js"
import authRoute from "./routes/auth.routes.js"
import {ErrorMiddleware} from "./middlewares/index.js"

config()

mongoose.connect(process.env.MONGOOSE_CONNECTION_URI).then(()=>{
    console.log('Connection Established')
}).catch(err=>console.log('Error connecting to DB ',err.message))

const app = express()
app.use(cors())

app.use(express.json())

app.use("/api/user",userRoute)
app.use("/api/auth",authRoute)

app.listen(3000,()=>{
    console.log('first')
})

app.use(ErrorMiddleware)