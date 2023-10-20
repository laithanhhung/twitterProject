import { Router } from 'express'
const userRouter = Router() //tạo ra 1 cái router
import { loginValidator, registerValidator } from '../middlewares/users.middlewares'
import { loginController, registerController } from '../controllers/users.controllers'

userRouter.get('/login', loginValidator, loginController) //đăng nhập

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

userRouter.post('/register', registerValidator, registerController) //đăng ký , bỏ qua middleware lun cho nhanh để hiểu cách hoạt động
//register không phải get mà là post vì nó sẽ gửi dữ liệu lên server nhiều hơn

export default userRouter //public ra để index.ts sử dụng
