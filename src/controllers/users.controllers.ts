import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import unsersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.requests'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'test@gmail.com' && password === '123456')
    return res.json({
      message: 'login successfully',
      result: [
        { name: 'Điệp', yob: 1999 },
        { name: 'Hùng', yob: 2003 },
        { name: 'Được', yob: 1994 }
      ]
    })
  return res.status(400).json({
    error: 'login faied'
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  //body đang là any nên phải ép nhập theo những kiểu dữ liệu mình muốn
  //=> tạo trong models 1 interface để định nghĩa kiểu dữ liệu tên requests (để định nghĩa kiểu dữ liệu cho req.body)

  try {
    //lưu vào database
    const result = await unsersService.register(req.body)
    return res.json({
      message: 'Đăng ký thành công',
      data: result
    })
  } catch (error) {
    res.status(400).json({
      message: 'Đăng ký thất bại',
      error
    })
  }
}
