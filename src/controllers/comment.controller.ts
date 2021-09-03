import { Response } from 'express'
import { ValidationError } from 'sequelize'
import { Request } from '../utils/handlers/request'
import { BaseController } from './base.controller'
import { HTTP_STATUS } from '../config/http_status'
import { ERROR_CODE } from '../config/error_code'
import { sendSuccess, sendError } from '../utils/handlers/send_response'
import { validationMessages } from '../utils/handlers/validation_messages'

import UserSub, { roles } from '../models/user_sub.model'
import Comment from '../models/comment.model'

export class CommentController extends BaseController {
  public create = async (req: Request, res: Response) => {
    try {
      const comment = await Comment.create({
        content: req.body.content.trim(),
        userId: req.currentUser.userId,
        postId: req.body.postId,
        parentId: req.body.parentId,
      })

      return sendSuccess(res, comment)
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

  public delete = async (req: Request, res: Response) => {
    try {
      const userId = req.currentUser.userId
      const comment = await Comment.findOne({
        where: { id: req.body.id },
      })

      if (!comment)
        return sendError(
          res,
          HTTP_STATUS.NOT_FOUND,
          ERROR_CODE.RECORD_NOT_FOUND,
        )

      const post = await comment.getPost()
      const userSub = await UserSub.findOne({
        where: { userId, subId: post.subId },
      })

      if (
        !(
          comment.userId === userId ||
          (userSub && userSub.role === roles.admin)
        )
      ) {
        return sendError(
          res,
          HTTP_STATUS.FORBIDDEN,
          ERROR_CODE.PERMISSION_DENIED,
        )
      }

      await comment.update({ content: '[deleted]', isDeleted: true })

      sendSuccess(res, {})
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
