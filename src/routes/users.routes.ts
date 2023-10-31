import { Router } from 'express'
const usersRouter = Router() //tạo ra 1 cái router
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyForgotPasswordTokenValidator
} from '../middlewares/users.middlewares'
import {
  emailVerifyTokenValidatorController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  verifyForgotPasswordTokenController
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

/*
des: resend email verify token
khi email thất lạc hoặc hết hạn thì người dùng có nhu cầu resend lại email verify token
path: /users/resend-verify-email
method: post
header: {Authorization: Bearer <access_token>}//đăng nhập mới dc resend
body: {}
*/
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))

/*
des: khi ng dùng quên mk, họ gửi email để xin mình tạo cho họ forgot_password_token
path: /users/forgot-password
method: post
body: {email: string}
*/
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/*
des: khi ng dùng nhấp vào link trong email để reset mk
họ sẽ gui63 1 req kèm theo forgot_password_token lên server
server sẽ kiểm tra forgot_password_token có hợp lệ hay không
sau đó chuyển hướng họ đén trang reset password
path: /users/verify-forgot-password
method: post
body: {forgot_password_token: string}
*/

usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)
export default usersRouter //public ra để index.ts sử dụng
