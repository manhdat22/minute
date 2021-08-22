import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import router from './routes'
import sequelize from './models'
import { morganLogger } from './middlewares/morgan'

// initialize dotenv
dotenv.config()

const app = express()
const port = process.env.PORT
const host = process.env.HOST
const corsOptions = {
  origin: process.env.ORIGIN,
}

// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// initialize cors
app.use(cors(corsOptions))

// logger
app.use(morganLogger())

// router
app.use(router)

sequelize.authenticate().then(() => {
  app.listen(port, () => {
    console.log(`Server started at ${host}:${port}`)
  })
})
