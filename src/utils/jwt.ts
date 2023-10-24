import jwt, { SignOptions } from 'jsonwebtoken'
import { config } from 'dotenv'
config()
// jwt.sign(payload, secretOrPrivateKey, [options, callback]) : 1 chữ kí bao gồm
//payload: user_id, ngày hết hạn, token-type(access_token, refresh_token),
//secretOrPrivateKey: chuỗi mật khẩu bí mật để mã hóa
//options: muốn mã hóa theo gì (algorithm: HS256,..)
//callback: sau khi mã hóa thì làm gì => tự độ không có cần truyền trước nên chỉ truyền 3 thằng: payload, secretOrPrivateKey, options

//hàm nhận vào payload, privateKey, options từ đó ký tên
export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey?: string //thêm dấu ? vì do mình có thêm key mặc định trong .env
  options: SignOptions
}) => {
  //biến thành object cho lúc truyền mình biết thứ tự truyền vào
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

//hàm tạo refresh_token
