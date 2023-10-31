import { Router } from 'express'
const usersRouter = Router() //tạo ra 1 cái router
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '../middlewares/users.middlewares'
import {
  emailVerifyTokenValidatorController,
  loginController,
  logoutController,
  registerController
} from '../controllers/users.controllers'
import { wrapAsync } from '~/utils/handlers'

usersRouter.get('/login', loginValidator, wrapAsync(loginController)) //đăng nhập
/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/

/*
Description: Register new user
Path: /users/register
Method: POST
body:{
    name: string,
    email: string,
    password: string
    confirm_password: string
    date_of_birth: string theo chuẩn ISO 8601 (YYYY-MM-DD) vì json ko có dữ liệu Date
}
//quy ước trong mongo biến thì dùng snake_case, trong js thì dùng camelCase
*/
usersRouter.post('/register', registerValidator, wrapAsync(registerController))
//register không phải get mà là post vì nó sẽ gửi dữ liệu lên server nhiều hơn

/*
  des: lougout
  path: /users/logout
  method: POST
  Header: {Authorization: Bearer <access_token>} -> để xác định user nào đang đăng nhập
  body: {refresh_token: string}
  */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/*
des: veridy email
khi nguồi dùng đăng ký họ sẽ nhan765 dc mail có link dạng
http://localhost:3000/users/verify-email?token=<email_verify_token>
nếu mà em nhấp vào link thì sẽ tạo ra req gửi lên email_verify_token lên server
server kiểm tra email_verify_token có hợp lệ hay không
thì từ decoded_email_verigy_token lấy user_id
và vào user_id  đó để update email_verify_token thành '', verify = 1, update_at
path: /users/verify-email
method: post
body: {email_verify_token: string}
*/
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyTokenValidatorController))

export default usersRouter //public ra để index.ts sử dụng
