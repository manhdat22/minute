import { Router } from 'express'
import auth from './auth.route'
import user from './user.route'

const rootRouter = Router()

rootRouter.use('/api/v1', auth)

rootRouter.use('/api/v1/me/', user)

export default rootRouter
