import { Router } from "express";
import {signin,signup,googleAuth} from "../controllers/auth.controller.js"
const authRouter = Router()

authRouter.post("/signin",signin)

authRouter.post("/signup",signup)

authRouter.post("/google",googleAuth)

export default authRouter