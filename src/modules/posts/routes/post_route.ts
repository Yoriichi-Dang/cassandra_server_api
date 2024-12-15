import express from 'express'
import PostController from '../controller/post.controller'
import authMiddleware from '@/middlewares/auth.middleware'
const postController = new PostController()
const router = express.Router()
router.get('/', authMiddleware, postController.getAllPostsAuth)
router.post('/', authMiddleware, postController.createPost)
router.get('/:postId', postController.getPostDetail)
export default router
