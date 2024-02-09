import {Router} from "express"
import { create ,getAllBlogs} from "../controllers/blog.controller.js"
import verifyToken from "../middlewares/authHandler.js"
import uploadHandler from "../middlewares/uploadHandler.js"

const blogRoute = Router()

blogRoute.post("/create",verifyToken,uploadHandler.single('image'),create)
blogRoute.get("/",getAllBlogs)

export default blogRoute