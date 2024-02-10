import errorHandler from "../utils/errorHandler.js"
import jwt from "jsonwebtoken"
import {config} from "dotenv"
config()

const verifyToken = (req,res,next) =>{
    const token = req.cookies.access_token;
    console.log(token,"token")
    if(!token) return next(errorHandler(401,"unauthorized"))
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err) {
            return next(errorHandler(401,err.message))
        } 
        req.user = user;
        next()
})
}

export default verifyToken