import { Router, Response, Request, NextFunction } from 'express'
import { AuthController } from '../controllers/auth.controller'
import auth from '../middlewares/auth'

const authController = new AuthController()
const router = Router()

router.post('/login', authController.login)

router.post('/register', authController.register)

router.post('/logout', auth, authController.logout)

export default router
