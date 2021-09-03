import { Router, Response, Request, NextFunction } from 'express'
import { UserController } from '../controllers/user.controller'
import { UploadController } from '../controllers/upload.controller'
import { auth, nonStrictAuth } from '../middlewares/auth'
import uploader from '../middlewares/uploader'

const userController = new UserController()
const uploadController = new UploadController()

const router = Router()

router.get('/', nonStrictAuth, userController.show)
router.put('/update', auth, userController.update)
router.post(
  '/upload-avatar',
  [auth, uploader.single('avatar')],
  uploadController.avatar,
)

export default router
