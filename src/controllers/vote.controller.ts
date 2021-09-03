import { Response } from 'express'
import { ValidationError } from 'sequelize'
import { Request } from '../utils/handlers/request'
import { BaseController } from './base.controller'
import { HTTP_STATUS } from '../config/http_status'
import { ERROR_CODE } from '../config/error_code'
import { sendSuccess, sendError } from '../utils/handlers/send_response'
import { validationMessages } from '../utils/handlers/validation_messages'

import UserSub, { roles } from '../models/user_sub.model'
import Vote from '../models/vote.model'

export class VoteController extends BaseController {
  public create = async (req: Request, res: Response) => {
    try {
      const userId = req.currentUser.userId
      const parentId = req.body.parentId
      const parentType = req.body.parentType
      const vote = await Vote.findOne({
        where: { userId, parentId, parentType },
      })

      if (vote) {
        await vote.destroy()
      } else {
        await Vote.create({ userId, parentId, parentType })
      }

      return sendSuccess(res, { vote })
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
}
