import { Router } from 'express'
const usersRouter = Router() //tạo ra 1 cái router
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '../middlewares/users.middlewares'
import { loginController, logoutController, registerController } from '../controllers/users.controllers'
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

export default usersRouter //public ra để index.ts sử dụng
