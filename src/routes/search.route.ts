import { Router } from 'express'
import { SearchController } from '../controllers/search.controller'
import { nonStrictAuth } from '../middlewares/auth'

const searchController = new SearchController()
const router = Router()

router.get('/', nonStrictAuth, searchController.index)

export default router
