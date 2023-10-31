import jwt, { SignOptions } from 'jsonwebtoken'
import { config } from 'dotenv'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
config()
// jwt.sign(payload, secretOrPrivateKey, [options, callback]) : 1 chữ kí bao gồm
//payload: user_id, ngày hết hạn, token-type(access_token, refresh_token),
//secretOrPrivateKey: chuỗi mật khẩu bí mật để mã hóa
//options: muốn mã hóa theo gì (algorithm: HS256,..)
//callback: sau khi mã hóa thì làm gì => tự độ không có cần truyền trước nên chỉ truyền 3 thằng: payload, secretOrPrivateKey, options

//hàm nhận vào payload, privateKey, options từ đó ký tên
export const signToken = ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey: string
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

//hàm nhận vào Token, và secretOrPublickKey
export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  //trả về JwtPayload(thông tin người gữi req) nếu token hợp lệ
  return new Promise<TokenPayload>((resolve, reject) => {
    //method này sẽ verify token, nếu token hợp lệ thì nó sẽ trả về payload
    //nếu token không hợp lệ thì nó sẽ throw error
    //secretOrPublicKey dùng để verify token
    //nếu token được tạo ra bằng secret|PublicKey thì ta dùng secret|PublicKey key để verify
    //từ đó biết rằng access_token được tạo bởi chính server
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) throw reject(error)
      resolve(decoded as TokenPayload)
    })
  })
}
