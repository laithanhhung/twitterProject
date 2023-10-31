import { NextFunction, Response, Request } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

export const defaulltErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  //lỗi từ các nơi sẽ dồn về đây
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }
  //nếu mà lỗi xuống dc đây là lỗi mặc định
  //Error gồm: set name, stask, message về enumerable: true để nó có thể lấy được
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true }) //chạy foreach để đổi key trong err thành enumerable:true để nó có thể lấy được
  })
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: omit(err, ['stack'])
  })
}
