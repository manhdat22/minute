import { Router, Response, Request, NextFunction } from 'express'
import { UploadController } from '../controllers/upload.controller'
import { SubController } from '../controllers/sub.controller'
import { auth, nonStrictAuth } from '../middlewares/auth'
import uploader from '../middlewares/uploader'

const subController = new SubController()
const uploadController = new UploadController()

const router = Router()

router.get('/', nonStrictAuth, subController.show)
router.get('/fetch-sub', auth, subController.index)
router.post('/create', auth, subController.create)
router.post('/subscribe', auth, subController.subscribe)
router.post('/unsubscribe', auth, subController.unsubscribe)
router.put('/update', auth, subController.update)
router.post(
  '/upload-icon',
  [auth, uploader.single('icon')],
  uploadController.icon,
)

export default router
