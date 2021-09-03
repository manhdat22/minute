import { Router } from 'express'
import { VoteController } from '../controllers/vote.controller'
import { auth } from '../middlewares/auth'

const voteController = new VoteController()
const router = Router()

router.post('/create', auth, voteController.create)

export default router
