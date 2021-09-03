import { Response } from 'express'
import { Op, Sequelize, ValidationError } from 'sequelize'
import { Request } from '../utils/handlers/request'
import { BaseController } from './base.controller'
import { HTTP_STATUS } from '../config/http_status'
import { ERROR_CODE } from '../config/error_code'
import { sendSuccess, sendError } from '../utils/handlers/send_response'
import { validationMessages } from '../utils/handlers/validation_messages'

import UserSub, { roles } from '../models/user_sub.model'
import Comment from '../models/comment.model'
import Post from '../models/post.model'
import Sub from '../models/sub.model'
import User from '../models/user.model'

export class SearchController extends BaseController {
  public index = async (req: Request, res: Response) => {
    try {
      const keyword = req.query.keyword ? req.query.keyword.trim() : null

      if (!keyword)
        return sendError(res, HTTP_STATUS.BAD_REQUEST, ERROR_CODE.INVALID)

      const likeQuery = { [Op.like]: `%${keyword}%` }

      const posts = await Post.findAll({
        attributes: [
          'id',
          'title',
          'content',
          'slug',
          'subId',
          'createdAt',
          'updatedAt',
          'authorId',
        ],
        order: [['createdAt', 'DESC']],
        where: {
          [Op.or]: [{ title: likeQuery }, { content: likeQuery }],
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username'],
          },
          {
            model: Sub,
            as: 'sub',
            attributes: ['id', 'name', 'slug', 'createdAt', 'description'],
          },
        ],
      })

      const users = await User.findAll({
        attributes: ['id', 'username', 'createdAt'],
        order: [['createdAt', 'DESC']],
        where: { username: likeQuery },
      })

      const subs = await Sub.findAll({
        attributes: [
          'id',
          'name',
          'description',
          'slug',
          [
            Sequelize.literal(
              `(SELECT EXISTS(SELECT * FROM userSubs WHERE userSubs.subId = Sub.id AND userSubs.userId = ${
                req.currentUser?.userId || null
              }))`,
            ),
            'subscribed',
          ],
          [
            Sequelize.literal(
              `(SELECT userSubs.role FROM userSubs WHERE userSubs.subId = Sub.id AND userSubs.userId = ${
                req.currentUser?.userId || null
              })`,
            ),
            'role',
          ],
        ],
        order: [['createdAt', 'DESC']],
        where: { name: likeQuery },
      })

      sendSuccess(res, { posts, users, subs })
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
