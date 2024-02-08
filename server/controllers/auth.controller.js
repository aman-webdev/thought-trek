import { User } from "../models/index.js";
import errorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const signin = async (req, res,next) => {
  try{

    const {usernameOrEmail,password} = req.body;
    if(!usernameOrEmail || !password) {
      next(errorHandler(404,"Email / Username or password missing"))
      return;
    }

    // check with username first
    let userData = await User.findOne({username:usernameOrEmail}).lean()
    if(!userData) userData = await User.findOne({email:usernameOrEmail}).lean()
    if(!userData) {
      next(errorHandler(400,"User not found"))
      return; 
    }

    const isCorrectPass = bcrypt.compareSync(password,userData.password)
    if(!isCorrectPass) {
      next(errorHandler(400,"Incorrect username / email or password"))
      return
    }

    const token = jwt.sign({
      id:userData._id
    } , process.env.JWT_SECRET_KEY)
    
    const {password:userPass,...restUser} = userData;

    return res.status(200).cookie('access_token' , token , {httpOnly:true}).json({message:"Signin Successfull" , data:restUser })
    
  }catch(err){
    next(err)
  }
};

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      const error = errorHandler(400, "Required parameters missing");
      next(error);
      return;
    }

    const hashedPass = bcrypt.hashSync(password, 10);
    const existingUsername = await User.findOne({username})
    if(existingUsername) {
      next(errorHandler(401,"Username already exists"))
      return
    } 

    const existingEmail = await User.findOne({email})
    if(existingEmail) {
      next(errorHandler(401,"Email already exists"))
      return
    } 
    const user = await User.create({ username, email, password: hashedPass });
    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
};


export const googleAuth=async(req,res,next) => {
  const {token} = req.body;
  if(!token) return next(errorHandler(401,"Required parameter token missing"))
  const data = jwt.decode(token)
  const {email,name,picture} = data;
  
  // check if user exists with this email
  let userData = await User.findOne({email}).lean()
  if(userData) {
    const tokenData = jwt.sign({id:userData._id},process.env.JWT_SECRET_KEY)
    delete userData.password
    return res.status(200).cookie("access_token",tokenData,{httpOnly:true}).json({message:"Signin Successfull",data:userData})
  }
  // generate a random pass
  const genPass = Math.random().toString(36).slice(-8)
  const password = bcrypt.hashSync(genPass,10)

  const username = name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4)

  const newuser = await User.create({email,username,password , profilePicture:picture})

  const {password:existingPass,...restUser} = newuser._doc

  const tokenData = jwt.sign({id:newuser._id},process.env.JWT_SECRET_KEY)

  return res.status(200).cookie("access_token",tokenData,{httpOnly:true}).json({message:"Signin Successfull",data:newUser})


}