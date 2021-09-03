import { Router } from 'express'
import { UploadController } from '../controllers/upload.controller'
import { PostController } from '../controllers/post.controller'
import { auth, nonStrictAuth } from '../middlewares/auth'
import uploader from '../middlewares/uploader'

const postController = new PostController()
const uploadController = new UploadController()
const router = Router()

router.get('/', nonStrictAuth, postController.index)
router.get('/show', nonStrictAuth, postController.show)
router.post('/create', auth, postController.create)
router.put('/update', auth, postController.update)
router.delete('/delete', auth, postController.delete)
router.post(
  '/upload-media',
  [auth, uploader.single('media')],
  uploadController.media,
)

export default router
