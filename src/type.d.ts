//file này dùng để định nghĩa lại Request truyền lên từ client
import { Request } from 'express'
import User from './models/schemas/User.schema'

declare module 'express' {
  interface Request {
    user?: User
  }
}
