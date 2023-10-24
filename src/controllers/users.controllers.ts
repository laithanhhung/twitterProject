import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import unsersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.requests'

export const loginController = async (req: Request, res: Response) => {
  //lấy user_id từ user của req
  const { user }: any = req
  const user_id = user._id //object id của user
  //dùng user_id do01 tạo access_token và fresh_token
  const result = await unsersService.login(user_id.toString())
  //res về access_token và fresh_token cho client
  res.json({
    message: 'Đăng nhập thành công',
    data: result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  //body đang là any nên phải ép nhập theo những kiểu dữ liệu mình muốn
  //=> tạo trong models 1 interface để định nghĩa kiểu dữ liệu tên requests (để định nghĩa kiểu dữ liệu cho req.body)
  //lưu vào database
  const result = await unsersService.register(req.body)

  return res.json({
    message: 'Đăng ký thành công',
    data: result
  })
}
