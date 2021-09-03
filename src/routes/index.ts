import { Router } from 'express'
import auth from './auth.route'
import user from './user.route'
import search from './search.route'
import sub from './sub.route'
import post from './post.route'
import comment from './comment.route'
import vote from './vote.route'

const rootRouter = Router()

rootRouter.use('/api/v1', auth)
rootRouter.use('/api/v1/sub/', sub)
rootRouter.use('/api/v1/post/', post)
rootRouter.use('/api/v1/comment/', comment)
rootRouter.use('/api/v1/vote/', vote)
rootRouter.use('/api/v1/profile/', user)
rootRouter.use('/api/v1/search/', search)

export default rootRouter
