//hàm mã hóa password
//theo chuẩn SHA-256
import { createHash } from 'crypto'
import { config } from 'dotenv'
config()
//tạo 1 hàm mã hóa password nhận vào chuỗi là mã hóa theo chuẩn sha256
function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

//hàm nhận vào password và trả về password đã mã hóa

export function hashPassword(password: string) {
  return sha256(password + process.env.PASSWORD_SECRET) //nếu như chỉ password thì ngta sẽ mã hóa lại => phải cho thêm 1 mật khẩu bí mật nữa lưu vào env
}
