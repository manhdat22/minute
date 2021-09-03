import { Router } from 'express'
import { CommentController } from '../controllers/comment.controller'
import { auth } from '../middlewares/auth'

const commentController = new CommentController()
const router = Router()

router.post('/create', auth, commentController.create)
router.put('/delete', auth, commentController.delete)

export default router
