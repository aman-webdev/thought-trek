import express from "express"
import {test,updateUser} from "../controllers/user.controller.js"
import {authHandler, uploadHandler} from "../middlewares/index.js"
const router = express.Router()

router.get("/test",test)
router.put("/update/:userId",authHandler,uploadHandler.single("image"),updateUser)

export default router;