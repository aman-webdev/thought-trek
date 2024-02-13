import express from 'express'
import { createComment, getBlogComments ,likeComment , editComment,deleteComment } from '../controllers/comment.controller.js';
import verifyToken from '../middlewares/authHandler.js';

const router = express.Router();

router.post("/create",verifyToken,createComment)
// TODO: redo get using aggregate
router.get("/comments-by-blog/:blogId",getBlogComments)
router.patch("/like/:commentId",verifyToken,likeComment)
router.patch('/edit/:commentId',verifyToken,editComment)
router.delete('/delete/:commentId',verifyToken,deleteComment)

export default router