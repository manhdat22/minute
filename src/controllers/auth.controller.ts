// tslint:disable-next-line: no-var-requires
require('dotenv').config()

import { Response } from 'express'
import { Request } from '../utils/handlers/request'
import { Op, ValidationError } from 'sequelize'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { HTTP_STATUS } from '../config/http_status'
import { ERROR_CODE } from '../config/error_code'
import { sendSuccess, sendError } from '../utils/handlers/send_response'
import { validationMessages } from '../utils/handlers/validation_messages'

import User from '../models/user.model'

export class AuthController {
  public register = async (req: Request, res: Response) => {
    try {
      const pattern = /^\S{8,32}$/
      const { username, email, password } = req.body

      if (!(email && password && username) || !pattern.test(password))
        return sendError(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          ERROR_CODE.INVALID,
        )

      const encryptedPassword = await bcrypt.hash(password, 10)

      const user = await User.create({
        username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      })

      const token = jwt.sign(
        { userId: user.id, username },
        process.env.TOKEN_SECRET,
        {
          expiresIn: process.env.TOKEN_EXPIRED_TIME,
        },
      )

      user.token = token

      sendSuccess(res, { user })
    } catch (e) {
      console.log(e)

      if (e instanceof ValidationError) {
        sendError(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          ERROR_CODE.INVALID,
          validationMessages(e),
        )
      } else {
        sendError(
          res,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          ERROR_CODE.INTERNAL_ERROR,
        )
      }
    }
  }

  public login = async (req: Request, res: Response) => {
    try {
      const id = req.body.id.toLowerCase()
      const password = req.body.password

      if (!(id && password))
        return sendError(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          ERROR_CODE.INVALID,
        )

      const user = await User.findOne({
        where: { [Op.or]: [{ email: id }, { username: id }] },
      })

      if (user && (await bcrypt.compare(password, user.password))) {
        user.token = this.signUserToken(user)

        sendSuccess(res, { user })
      } else {
        sendError(res, HTTP_STATUS.BAD_REQUEST, ERROR_CODE.INVALID_CREDENTIALS)
      }
    } catch (e) {
      console.log(e)

      sendError(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODE.INTERNAL_ERROR,
      )
    }
  }

  public getCurrentUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ where: { id: req.currentUser.userId } })

      sendSuccess(res, { user })
    } catch (e) {
      console.log(e)

      sendError(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODE.INTERNAL_ERROR,
      )
    }
  }

  private signUserToken = (user: User): string => {
    return jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRED_TIME,
    })
  }
}
