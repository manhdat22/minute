import { Sequelize } from 'sequelize'
import Comment from './comment.model'
import Post from './post.model'
import PostMedia from './post_media.model'
import Sub from './sub.model'
import Upload from './upload.model'
import User from './user.model'
import UserSub from './user_sub.model'
import Vote from './vote.model'

const env = process.env.NODE_ENV || 'development'
// tslint:disable-next-line: no-var-requires
const config = require('../config/database.ts')[env]

const sequelize = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config)

const models = [Comment, Post, Sub, Upload, User, UserSub, Vote, PostMedia]

models.forEach((model) => model.initialize(sequelize))

models.forEach((model) => model.associate())

export default sequelize
