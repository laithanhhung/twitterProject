import express from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { Request, Response, NextFunction } from 'express'
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req) //đi qua từng check lỗi rồi lưu trong req

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next() //qua controller
    }

    res.status(400).json({ errors: errors.mapped() }) //đệp hơn thay vì array()
  }
}
// bỏ checkSchema vào trong validate vào trong route code middleware do chỉ là bước check nhỏ nên bỏ vào utils
