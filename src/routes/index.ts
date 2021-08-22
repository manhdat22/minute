import { Router } from 'express'
import auth from './auth.route'

const rootRouter = Router()

rootRouter.use('/api/v1', auth)

export default rootRouter
