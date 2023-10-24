import express from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import e, { Request, Response, NextFunction } from 'express'
import { EntityError, ErrorWithStatus } from '~/models/Errors'
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req) //đi qua từng check lỗi rồi lưu trong req

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next() //qua controller
    }
    const errorObject = errors.mapped() //lấy ra object lỗi
    const entityError = new EntityError({ errors: {} }) //tạo ra 1 object lỗi
    //Xử lý ERROROBJECT
    for (const key in errorObject) {
      const { msg } = errorObject[key]
      //nếu msg có đang ErrorWithStatus và status !== 422 thì ném
      //cho default error handler
      if (msg instanceof ErrorWithStatus && msg.status !== 422) {
        return next(msg)
      }

      //lưu các lỗi 422 từ errorObject vào entityError
      entityError.errors[key] = msg
    }

    //ở đây nó xử lý lỗi lun chứ hg ném về Error tổng(error defaullt handler) giải quyết
    next(entityError)
  }
}
// bỏ checkSchema vào trong validate vào trong route code middleware do chỉ là bước check nhỏ nên bỏ vào utils
