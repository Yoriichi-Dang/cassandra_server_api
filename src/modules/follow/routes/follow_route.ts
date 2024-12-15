import express from 'express'
import FollowController from '../controller/follow.controller'
import authMiddleware from '@/middlewares/auth.middleware'
const router = express.Router()
const followController = new FollowController()
router.get('/', authMiddleware, followController.checkFollow)
router.post('/', authMiddleware, followController.followUser)
router.delete('/', authMiddleware, followController.unFollowUser)
export default router
