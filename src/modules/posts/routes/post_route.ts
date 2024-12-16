import express from 'express'
import PostController from '../controller/post.controller'
import authMiddleware from '@/middlewares/auth.middleware'
const postController = new PostController()
const router = express.Router()
router.get('/', authMiddleware, postController.getAllPostsAuth)
router.get('/public', postController.getPostPublicAllByUserId)
router.get('/all', postController.getPostsPublicAll)
router.get('/:postId', postController.getPostDetail)
router.get('/follow', authMiddleware, postController.getPostUserFollow)
router.post('/', authMiddleware, postController.createPost)
export default router
