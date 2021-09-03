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
import User from '../models/user.model'
import Upload from '../models/upload.model'

export class UploadController extends BaseController {
  public avatar = async (req: Request, res: Response) => {
    try {
      const currentUser = await User.findByPk(req.currentUser.userId)
      if (!currentUser)
        sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODE.INVALID)

      const url = req.file.path.replace('client/public', '')
      const avatar = await Upload.create({ url, uploadType: 'avatar' })

      await currentUser.update({ avatarId: avatar.id }, { validate: false })

      return sendSuccess(res, { url: avatar.url })
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

  public icon = async (req: Request, res: Response) => {
    try {
      const url = req.file.path.replace('client/public', '')
      const media = await Upload.create({
        url,
        uploadType: 'icon',
      })

      return sendSuccess(res, { url: media.url, id: media.id })
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

  public media = async (req: Request, res: Response) => {
    try {
      // const fileList: Upload[] = []

      // req.files.forEach(async (file: any) => {
      //   const url = file.path.replace('client/public', '')

      //   const media = await Upload.create({
      //     url,
      //     uploadType: 'media',
      //   })

      //   fileList.push(media)
      // })

      // return sendSuccess(res, { fileList })

      const url = req.file.path.replace('client/public', '')
      const media = await Upload.create({
        url,
        uploadType: 'media',
      })

      return sendSuccess(res, { url: media.url, id: media.id })
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
