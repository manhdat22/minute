import { Sequelize } from 'sequelize'
import User from './user.model'

const env = process.env.NODE_ENV || 'development'
// tslint:disable-next-line: no-var-requires
const config = require('../config/database.ts')[env]

const sequelize = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config)

const models = [User]

models.forEach((model) => model.initialize(sequelize))

models.forEach((model) => model.associate())

export default sequelize
