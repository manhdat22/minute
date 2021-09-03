import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { sendError } from '../utils/handlers/send_response'
import { HTTP_STATUS } from '../config/http_status'
import { ERROR_CODE } from '../config/error_code'

export const auth = (req: Request | any, res: Response, next: NextFunction) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token']

  if (!token) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_CODE.MISSING_TOKEN)
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    req.currentUser = decoded
  } catch (err) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_CODE.INVALID_TOKEN)
  }
  return next()
}

export const nonStrictAuth = (
  req: Request | any,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
      req.currentUser = decoded
    } catch (err) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_CODE.INVALID_TOKEN)
    }
  }

  return next()
}
