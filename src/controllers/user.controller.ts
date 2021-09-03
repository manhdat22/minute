import { Response } from 'express'
import { Op, QueryTypes, Sequelize, ValidationError } from 'sequelize'
import { Request } from '../utils/handlers/request'
import { BaseController } from './base.controller'
import { HTTP_STATUS } from '../config/http_status'
import { ERROR_CODE } from '../config/error_code'
import { sendSuccess, sendError } from '../utils/handlers/send_response'
import { validationMessages } from '../utils/handlers/validation_messages'

import sequelize from '../models'
import User from '../models/user.model'
import Post from '../models/post.model'
import Sub from '../models/sub.model'
import UserSub from '../models/user_sub.model'
import Upload from '../models/upload.model'

export class UserController extends BaseController {
  public async show(req: Request, res: Response): Promise<void> {
    try {
      const profile = await User.findOne({
        where: { username: req.query.username },
        attributes: ['id', 'username', 'bio', 'createdAt'],
      })

      if (!profile)
        sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODE.INVALID)

      const { count, rows } = await Post.scope({
        method: [
          'postAttributes',
          req.currentUser ? req.currentUser.userId : 'null',
        ],
      }).findAndCountAll({
        where: { authorId: profile.id },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Upload,
            as: 'media',
          },
          {
            model: Sub,
            as: 'sub',
            attributes: ['id', 'name', 'slug', 'description', 'createdAt'],
          },
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username'],
          },
        ],
      })

      const userSubs = await UserSub.findAll({
        where: { userId: profile.id },
      })
      const subIds = userSubs.map((us: UserSub) => us.subId)
      const subs = await Sub.findAll({ where: { id: { [Op.in]: subIds } } })

      sendSuccess(res, {
        profile,
        posts: rows,
        subs,
        totalPosts: count,
      })
    } catch (e) {
      console.log(e)

      sendError(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODE.INTERNAL_ERROR,
      )
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.update(
        {
          bio: req.body.bio,
        },
        { where: { id: req.currentUser.userId } },
      )

      if (user) {
        sendSuccess(res, user)
      } else {
        sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_CODE.RECORD_NOT_FOUND)
      }
    } catch (e) {
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
