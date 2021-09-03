import { Response } from 'express'
import { QueryTypes, ValidationError } from 'sequelize'
import { Request } from '../utils/handlers/request'
import { BaseController } from './base.controller'
import { HTTP_STATUS } from '../config/http_status'
import { ERROR_CODE } from '../config/error_code'
import { sendSuccess, sendError } from '../utils/handlers/send_response'
import { validationMessages } from '../utils/handlers/validation_messages'

import sequelize from '../models'
import Sub from '../models/sub.model'
import Post from '../models/post.model'
import UserSub, { roles } from '../models/user_sub.model'
import User from '../models/user.model'
import Upload from '../models/upload.model'

export class SubController extends BaseController {
  public index = async (req: Request, res: Response) => {
    try {
      const subs = await sequelize.query(
        `SELECT subs.id, subs.name FROM subs JOIN userSubs ON userSubs.subId = subs.id WHERE userSubs.userId = ${req.currentUser.userId}`,
        { type: QueryTypes.SELECT },
      )

      sendSuccess(res, { subs })
    } catch (e) {
      console.log(e)

      sendError(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODE.INTERNAL_ERROR,
      )
    }
  }

  public show = async (req: Request, res: Response) => {
    try {
      const sub = await Sub.findOne({
        where: { slug: req.query.slug },
      })

      if (!sub) {
        return sendError(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          ERROR_CODE.INVALID,
        )
      }
      const userSub = await UserSub.findOne({
        where: {
          subId: sub.id,
          userId: req.currentUser?.userId || 'null',
        },
        attributes: ['role'],
      })

      const role = userSub ? userSub.role : null

      const { count, rows } = await Post.scope({
        method: [
          'postAttributes',
          req.currentUser ? req.currentUser.userId : 'null',
        ],
      }).findAndCountAll({
        where: { subId: sub.id },
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

      const totalSubscribers = await UserSub.count({ where: { subId: sub.id } })

      sendSuccess(res, {
        sub,
        role,
        posts: rows,
        totalPosts: count,
        totalSubscribers,
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

  public create = async (req: Request, res: Response) => {
    try {
      const result = await sequelize.transaction(async (t) => {
        const sub = await Sub.create(
          {
            iconId: req.body.iconId,
            name: req.body.name,
            description: req.body.description,
          },
          { transaction: t },
        )

        await UserSub.create(
          {
            userId: req.currentUser.userId,
            subId: sub.id,
            role: roles.admin,
          },
          { transaction: t },
        )

        return sub
      })

      return sendSuccess(res, { sub: result })
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

  public subscribe = async (req: Request, res: Response) => {
    try {
      await UserSub.findOrCreate({
        where: {
          userId: req.currentUser.userId,
          subId: req.body.id,
        },
        defaults: {
          userId: req.currentUser.userId,
          subId: req.body.id,
          role: roles.subscriber,
        },
      })

      sendSuccess(res, {})
    } catch (e) {
      console.log(e)

      sendError(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODE.INTERNAL_ERROR,
      )
    }
  }

  public unsubscribe = async (req: Request, res: Response) => {
    try {
      const userSub = await UserSub.findOne({
        where: {
          userId: req.currentUser.userId,
          subId: req.body.id,
          role: roles.subscriber,
        },
      })

      if (!userSub)
        return sendError(
          res,
          HTTP_STATUS.NOT_FOUND,
          ERROR_CODE.RECORD_NOT_FOUND,
        )

      await userSub.destroy()

      sendSuccess(res, {})
    } catch (e) {
      console.log(e)

      sendError(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODE.INTERNAL_ERROR,
      )
    }
  }

  public update = async (req: Request, res: Response) => {
    try {
      const userSub = await UserSub.findOne({
        where: { userId: req.currentUser.userId, subId: req.body.id },
      })

      if (!userSub || userSub.role !== roles.admin)
        return sendError(
          res,
          HTTP_STATUS.FORBIDDEN,
          ERROR_CODE.PERMISSION_DENIED,
        )

      const sub = await Sub.update(
        {
          iconId: req.body.iconId,
          description: req.body.description,
        },
        { where: { id: req.body.id } },
      )

      if (!sub)
        return sendError(
          res,
          HTTP_STATUS.NOT_FOUND,
          ERROR_CODE.RECORD_NOT_FOUND,
        )

      sendSuccess(res, { sub })
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
