import { Response } from 'express'
import { ValidationError } from 'sequelize'
import { Request } from '../utils/handlers/request'
import { BaseController } from './base.controller'
import { HTTP_STATUS } from '../config/http_status'
import { ERROR_CODE } from '../config/error_code'
import { sendSuccess, sendError } from '../utils/handlers/send_response'
import { validationMessages } from '../utils/handlers/validation_messages'

import User from '../models/user.model'

export class UserController extends BaseController {
  public async show(req: Request, res: Response): Promise<void> {
    try {
      const currentUser = await User.findByPk(req.currentUser.user_id)
      if (!currentUser) sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODE.INVALID)

      sendSuccess(res, currentUser)
    } catch (e) {
      console.log(e)

      sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODE.INTERNAL_ERROR)
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.update(
        {
          // avatar: xxx
          bio: req.body.bio,
        },
        { where: { id: req.currentUser.user_id } },
      )

      if (user) {
        sendSuccess(res, user)
      } else {
        sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_CODE.RECORD_NOT_FOUND)
      }
    } catch (e) {
      if (e instanceof ValidationError) {
        sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODE.INVALID, validationMessages(e))
      } else {
        sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODE.INTERNAL_ERROR)
      }
    }
  }
}
