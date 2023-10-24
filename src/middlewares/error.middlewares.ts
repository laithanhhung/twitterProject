import { NextFunction, Response, Request } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'

export const defaulltErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  //lỗi từ các nơi sẽ dồn về đây
  res
    .status(err.status | HTTP_STATUS.INTERNAL_SERVER_ERROR /*lỗi 500: không biết lỗi là gì */)
    .json(omit(err, ['status'])) //lodash: omit bỏ status ra khỏi err
}
