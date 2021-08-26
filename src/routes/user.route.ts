import { Router, Response, Request, NextFunction } from 'express'
import { UserController } from '../controllers/user.controller'
import auth from '../middlewares/auth'

const userController = new UserController()
const router = Router()

router.get('/', auth, userController.show)

router.put('/update', auth, userController.update)

export default router
