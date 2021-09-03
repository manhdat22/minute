import { ErrorCode } from '../../config/error_code'
import { HttpStatus, HTTP_STATUS } from '../../config/http_status'
import { Response, NextFunction } from 'express'

export const sendSuccess = (response: Response, payload: any = {}): void => {
  response.status(HTTP_STATUS.OK).json({ status: HTTP_STATUS.OK, ...payload })
}

export const sendError = (
  response: Response,
  httpStatus?: HttpStatus,
  errorCode?: ErrorCode,
  payload?: any,
): void => {
  response.status(httpStatus).json({ ...payload, ...errorCode })
}
