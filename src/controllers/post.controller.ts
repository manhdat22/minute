import { Response } from 'express'
import { Op, Sequelize, ValidationError } from 'sequelize'
import { Request } from '../utils/handlers/request'
import { BaseController } from './base.controller'
import { HTTP_STATUS } from '../config/http_status'
import { ERROR_CODE } from '../config/error_code'
import { sendSuccess, sendError } from '../utils/handlers/send_response'
import { validationMessages } from '../utils/handlers/validation_messages'

import Sub from '../models/sub.model'
import UserSub, { roles } from '../models/user_sub.model'
import Post from '../models/post.model'
import Comment from '../models/comment.model'
import User from '../models/user.model'
import Upload from '../models/upload.model'

export class PostController extends BaseController {
  public index = async (req: Request, res: Response) => {
    try {
      let subIds: number[] = []

      if (req.currentUser) {
        const userSubs = await UserSub.findAll({
          where: { userId: req.currentUser.userId },
        })

        subIds = userSubs.map((us: UserSub) => us.subId)
      }

      const { count, rows } = await Post.scope({
        method: [
          'postAttributes',
          req.currentUser ? req.currentUser.userId : 'null',
        ],
      }).findAndCountAll({
        where: req.currentUser && { subId: { [Op.in]: subIds } },
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

      const subs = req.currentUser
        ? await Sub.findAll({ where: { id: { [Op.in]: subIds } } })
        : await Sub.findAll({ limit: 5 })

      sendSuccess(res, { posts: rows, totalPosts: count, subs })
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
      const post = await Post.findOne({
        attributes: [
          'id',
          'title',
          'content',
          'slug',
          'subId',
          'createdAt',
          'updatedAt',
          'authorId',
          [
            Sequelize.literal(
              `(SELECT EXISTS(SELECT * FROM votes WHERE votes.parentId = Post.id AND votes.parentType = "post" AND votes.userId = ${
                req.currentUser?.userId || null
              }))`,
            ),
            'voted',
          ],
        ],
        where: { slug: req.query.slug },
        order: [[{ model: Comment, as: 'comments' }, 'createdAt', 'DESC']],
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
          {
            model: Comment,
            as: 'comments',
            attributes: [
              'id',
              'userId',
              'content',
              'createdAt',
              'parentId',
              'postId',
              'isDeleted',
              [
                Sequelize.literal(
                  `(SELECT EXISTS(SELECT * FROM votes WHERE votes.parentId = comments.id AND votes.parentType = "comment" AND votes.userId = ${
                    req.currentUser?.userId || null
                  }))`,
                ),
                'voted',
              ],
              [
                Sequelize.literal(
                  '(SELECT COUNT(*) FROM votes WHERE votes.parentId = comments.id AND votes.parentType = "comment")',
                ),
                'voteCount',
              ],
            ],
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username'],
              },
            ],
          },
        ],
      })

      if (!post)
        return sendError(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          ERROR_CODE.INVALID,
        )

      const commentCount = await post.countComments()
      const voteCount = await post.countVotes()

      post.setDataValue('commentCount', commentCount)
      post.setDataValue('voteCount', voteCount)

      const sub = await Sub.findOne({
        where: { id: post.subId },
        attributes: ['id', 'name', 'slug', 'description', 'createdAt'],
      })
      const totalPosts = await Post.count({ where: { subId: sub.id } })
      const totalSubscribers = await UserSub.count({ where: { subId: sub.id } })
      const userSub = await UserSub.findOne({
        where: {
          subId: sub.id,
          userId: req.currentUser?.userId || 'null',
        },
        attributes: ['role'],
      })

      const role: string | number = userSub ? userSub.role : null
      const isAuthor = post.authorId === req.currentUser?.userId

      sendSuccess(res, {
        sub,
        role,
        isAuthor,
        post,
        totalPosts,
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
      const post = await Post.create({
        title: req.body.title,
        content: req.body.content,
        authorId: req.currentUser.userId,
        subId: req.body.subId,
        mediaId: req.body.mediaId,
      })

      return sendSuccess(res, { post })
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

  public update = async (req: Request, res: Response) => {
    try {
      const post = await Post.findOne({
        where: { id: req.body.id, authorId: req.currentUser.userId },
      })

      if (!post)
        return sendError(
          res,
          HTTP_STATUS.NOT_FOUND,
          ERROR_CODE.RECORD_NOT_FOUND,
        )

      await post.update({
        mediaId: req.body.mediaId,
        title: req.body.title,
        content: req.body.content,
      })

      sendSuccess(res, { post })
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
      const post = await Post.findOne({
        where: { id: req.query.id },
      })

      if (!post)
        return sendError(
          res,
          HTTP_STATUS.NOT_FOUND,
          ERROR_CODE.RECORD_NOT_FOUND,
        )

      const userSub = await UserSub.findOne({
        where: { userId, subId: post.subId },
      })

      if (
        !(post.authorId === userId || (userSub && userSub.role === roles.admin))
      ) {
        return sendError(
          res,
          HTTP_STATUS.FORBIDDEN,
          ERROR_CODE.PERMISSION_DENIED,
        )
      }

      await post.destroy()

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
