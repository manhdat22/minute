// tslint:disable-next-line: no-var-requires
require('dotenv').config()

import { Response } from 'express'
import { Request } from '../utils/handlers/request'
import { Op, ValidationError } from 'sequelize'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { BaseController } from './base.controller'
import { HTTP_STATUS } from '../config/http_status'
import { ERROR_CODE } from '../config/error_code'
import { sendSuccess, sendError } from '../utils/handlers/send_response'
import { validationMessages } from '../utils/handlers/validation_messages'
import { CustomValidationError } from '../utils/exceptions/custom_validation_error'
import User from '../models/user.model'

export class AuthController extends BaseController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const pattern = /^\S{8,32}$/
      const { username, email, password } = req.body

      if (!(email && password && username) || !pattern.test(password))
        return sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODE.INVALID)

      const encryptedPassword = await bcrypt.hash(password, 10)

      const user = await User.create({
        username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      })

      const token = jwt.sign({ user_id: user.id, username }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRED_TIME,
      })

      user.token = token

      sendSuccess(res, user)
    } catch (e) {
      console.log(e)

      if (e instanceof ValidationError) {
        sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODE.INVALID, validationMessages(e))
      } else {
        sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODE.INTERNAL_ERROR)
      }
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const id = req.body.id.toLowerCase()
      const password = req.body.password

      if (!(id && password))
        return sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODE.INVALID)

      const user = await User.findOne({
        where: { [Op.or]: [{ email: id }, { username: id }] },
      })

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { user_id: user.id, username: user.username },
          process.env.TOKEN_SECRET,
          {
            expiresIn: process.env.TOKEN_EXPIRED_TIME,
          },
        )

        user.token = token

        sendSuccess(res, user)
      } else {
        sendError(res, HTTP_STATUS.BAD_REQUEST, ERROR_CODE.INVALID_CREDENTIALS)
      }
    } catch (e) {
      console.log(e)

      sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODE.INTERNAL_ERROR)
    }
  }

  public async logout(req: Request | any, res: Response): Promise<void> {
    try {
      const currentUser = await User.findByPk(req.currentUser.user_id)
      if (!currentUser) sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODE.INVALID)

      currentUser.token = null

      sendSuccess(res, req.currentUser)
    } catch (e) {
      console.log(e)

      sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODE.INTERNAL_ERROR)
    }
  }
}
