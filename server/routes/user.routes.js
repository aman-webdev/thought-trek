import express from "express"
import {test,updateUser,deleteUser,signoutUser} from "../controllers/user.controller.js"
import {authHandler, uploadHandler} from "../middlewares/index.js"
const router = express.Router()

router.get("/test",test)
router.put("/update/:userId",authHandler,uploadHandler.single("image"),updateUser)
router.delete("/delete/:userId",authHandler,deleteUser)
router.post("/signout",signoutUser)

export default router;