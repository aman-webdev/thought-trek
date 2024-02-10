import {Router} from "express"
import { create ,getAllBlogs,deleteBlog,edit} from "../controllers/blog.controller.js"
import verifyToken from "../middlewares/authHandler.js"
import uploadHandler from "../middlewares/uploadHandler.js"

const blogRoute = Router()

blogRoute.post("/create",verifyToken,uploadHandler.single('image'),create)
blogRoute.get("/",getAllBlogs)
blogRoute.delete("/delete/:blogId",verifyToken,deleteBlog)
blogRoute.put("/edit/:blogId",verifyToken,uploadHandler.single('image'),edit)

export default blogRoute