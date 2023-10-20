//ta sẽ làm chức năng đăng nhập ./login
//khi mà đăng nhập, thì client truy cập login
//tạo ra 1 req, và bỏ vào trong đó email, password
//nhét email, password vào trong req.body
//và gửi lên server

import { Request, Response, NextFunction } from 'express' //sau khi thêm kiểu dữ liệu thì sẽ tự import interface(: định nghĩa cho 1 object) do express cung cấp
import { checkSchema } from 'express-validator'
import unsersService from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  //typecript nên phải để kiểu dữ liệu
  const { email, password } = req.body
  if (!email || !password) {
    //400 là lỗi từ client gửi lên server không hợp lý
    return res.status(400).json({
      message: `Bạn chưa nhập email hoặc password!`
    })
  }
  next()
}

export const registerValidator = validate(
  //dùng validate của validation.ts trogn utils
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      }
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const isExist = await unsersService.checkEmailExist(value)
          if (isExist) {
            throw new Error(`Email đã tồn tại!`)
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
          //returnScore: false,//true: trả về điểm số 1 - 10 cho mức độ mạnh yếu của password
        }
      },
      errorMessage: `Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!`
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
          //returnScore: false,//true: trả về điểm số 1 - 10 cho mức độ mạnh yếu của password
        }
      },
      errorMessage: `Confirm_password must be at least 8 characters long, including uppercase, lowercase, number and symbol!`,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(`Confirm_password không khớp!`)
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true, //nếu strict: false thì nó sẽ tự động chuyển đổi về đúng định dạng ISO 8601
          strictSeparator: true //nếu strictSeparator: false thì nó sẽ tự động chuyển đổi về đúng định dạng ISO 8601
        }
      }
    }
  })
)
