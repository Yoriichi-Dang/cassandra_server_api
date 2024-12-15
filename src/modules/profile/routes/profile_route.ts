import express from 'express'
import ProfileController from '../controller/profile.controller'
import authMiddleware from '@/middlewares/auth.middleware'
const router = express.Router()
const profileController = new ProfileController()
router.get('/', authMiddleware, profileController.getProfile)
router.put('/', authMiddleware, profileController.updateProfile)
router.get('/posts', authMiddleware, profileController.getUserPosts)
router.patch('/username', authMiddleware, profileController.updateUsername)
router.patch('/phone-email', authMiddleware, profileController.updatePhoneEmail)
router.patch('/avatar', authMiddleware, profileController.updateProfileImage)
export default router
