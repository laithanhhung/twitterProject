# I - OAuth2.0

- OAuth2.0: Open Authorization 2.0
- là giao thức : Đăng nhập bằng tài khoản Google, Facebook, Github
  ![Alt text](image-172.png)
- là một tiêu chuẩn được thiết kế để cho phép `một trang web hoặc ứng dụng` thay mặt người dùng truy cập các tài nguyên được lưu trữ bởi các ứng dụng web khác

# đăng ký sử dụng dịch vụ google OAuth

- Muốn thực hiện chức năng đăng ký / đăng nhập bằng một bênh thứ 3 như Google, Facebook, Github,... thì chúng ta cần phải đăng ký dịch vụ của họ trước, để họ biết App chúng ta là gì, cần truy cập vào thông tin gì,...

- chúng ta sẽ đăng ký dịch vụ Google OAuth để chạy trên localhost.

- Sau này muốn chạy trên domain thật thì nó có button Publish App

- Ở đây mình giả sử URL của mình như sau
  Client: http://localhost:3000
  Server: http://localhost:4000
- vào https://console.cloud.google.com/getting-started chọn
  ![Alt text](image-173.png)
- tạo project mới
  ![Alt text](image-174.png)
- điền thông tin chọn `create`
  ![Alt text](image-175.png)
- chọn project vừa tạo
  ![Alt text](image-176.png)
- tạo OAuth consent screen
  ![Alt text](image-177.png)
- điền thông tin và chọn `save and continue`
  ![Alt text](image-178.png)
  ![Alt text](image-179.png)
- chọn các quyền truy cập là `email`, và `save and continue`
  ![Alt text](image-180.png)
- thêm 1 user để test
  ![Alt text](image-181.png)
- kiểm tra lại 1 lần và `return to dashboard`
  ![Alt text](image-182.png)
- tạo credentials
  ![Alt text](image-183.png)
- điền thông tin trên

  ![Alt text](image-184.png)

- **trong hình viết sai url**
  trong đó `http://localhost:4000/users/oauth/google` mình sẽ thiết kế sau

- bấm dowload json và lưu file vào nơi dể tìm nhất
  ![Alt text](image-185.png)

# II - Flow Google OAuth

- giả sử mình có:
  Client: http://localhost:3000
  Server: http://localhost:4000
- thì flow đăng nhập sẽ là
  - 1.  họ truy cập vào giao diện đăng nhập `http://localhost:3000/login`
        bấm vào nút `đăng nhập bằng google`
  - 2. website sẽ redirect người dùng đến
       `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Foauth%2Fgoogle&client_id=480331042606-gm573du1155724l8f780em2fel1a5dd3.apps.googleusercontent.com&access_type=offline&response_type=code&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&service=lso&o2v=2&flowName=GeneralOAuthFlow`
    - để người dùng chọn tài khoản đăng nhập vào Google.
    - Các bạn để ý có mấy tham số query trên url là do website mình tự config và truyền vào.
    - Google sẽ xác thực các query này để xem thử đây là App nào, đã đăng ký Consent hay chưa, có được phép truy cập vào thông tin người dùng hay không.
  - 3. Người dùng `chọn tài khoản Google để đăng nhập`, khi đăng nhập thành công sẽ được google cho redirect về `http://localhost:4000/users/oauth/google?code=4%2F0AbUR2VPc2mJ0zoSxvWVI2XwyCV-8PwkVpIoUu1SBfV3CSYJ30orHOff_fse9GzsG0UpTtw&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent`.
       - Đây là `url api server` của mình.
       - Lúc này các bạn cũng để ý các query phía sau url như code, scope, đây là những tham số do google tự sinh ra và gửi lại cho mình.
       - hiểu khác là server gọi api của mình
  - 4. Server sẽ lấy được giá trị `code` thông qua query và tiến hành gọi lên Google API để lấy thông tin `id_token` và `access_token`
  - 5. Server sẽ lấy thông tin `id_token` và `access_token` để gọi lên Google API 1 lần nữa để lấy thông tin người dùng như `email, name, avatar, ...`
  - 6. **Có được email người dùng rồi** thì kiểm tra trong database xem thử email này đã được đăng ký chưa. Nếu chưa thì tạo mới user (mật khẩu có thể cho random, sau này người dùng reset mật khẩu để đổi mật khẩu cũng được)
  - 7. ta sẽ tạo `access_token` và `refresh_token` riêng, để cấu hình payload theo cá nhân mình
  - 8. Server redirect về `http://localhost:3000/login?access_token=...&refresh_token=...`
  - 9. Website của mình nhận được `access_token` và `refresh_token` qua query và tiến hành lưu vào local storage để sử dụng cho các request sau. Dùng cookie thì tại bước 8 chúng ta sẽ redirect về `http://localhost:3000/login `và set cookie ở đây.

# tiến thành thực hiện hóa chức năng login với google

- ta cái đặt [Reactvite](https://vitejs.dev/guide/) là 1 thư viện giúp chúng ta tạo ra các ứng dụng dạng single page

- ở đây mình sẽ thực hành luôn
- mình sẽ bật terminal ở ngoài folder project `CH05-twitterProject`(của mình là `nodejs-backend`) và cài đặt

  ```bash
  npm create vite@latest
  Need to install the following packages:
    create-vite@4.4.1
  Ok to proceed? (y) y
  √ Project name: ... TwitterClient
  √ Package name: ... twitterclient
  √ Select a framework: » React
  √ Select a variant: » JavaScript + SWC
  ```

- sau khi xong ta sẽ có 1 client folder tên `TwitterClient`, ta sẽ làm frontend trong thàng này, và mô phổng login

- ta terminal vào `TwitterClient` để tý nữa dể dàng cài đặt

  ```bash
  npm i
  ```

- vào `TwitterClient > vite.config.js` cấu hình một tý

  ```js
  export default defineConfig({
    plugins: [react()],
    css: {
      devSourcemap: true //giúp mình dể dàng debug lỗi css hơn
    },
    server: {
      port: 3000 //set client này có port: 3000, nên tý mình set backend của mình port 4000
    }
  })
  ```

- cài thêm router dom

  ```bash
  npm i react-router-dom
  ```

- mình sẽ định hướng router theo kiểu js, và vì các bạn chưa học react nên các bạn làm theo hướng dẫn

  - tạo component `src > Home.jsx`

    ```jsx
    import reactLogo from './assets/react.svg'
    import viteLogo from '/vite.svg'
    import './App.css'
    export default function Home() {
      return (
        <>
          <div>
            <span>
              <img src={viteLogo} className='logo' alt='Vite logo' />
            </span>
            <span>
              <img src={reactLogo} className='logo react' alt='React logo' />
            </span>
          </div>
          <h1>Google OAuth 2.0</h1>

          <p className='read-the-docs'>
            <button>Login with Google</button>
          </p>
        </>
      )
    }
    ```

  - tạo component `src > Login.jsx`

    ```jsx
    export default function Login() {
      return <div>Login</div>
    }
    ```

  - vào `src` tạo file `router.jsx`

    ```jsx
    import { createBrowserRouter } from 'react-router-dom'
    import Home from './Home'
    import Login from './Login'

    const router = createBrowserRouter([
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login/oauth',
        element: <Login />
      }
    ])

    export default router
    ```

  - trong file `App.jsx` xóa hết còn thế này

    ```jsx
    import { RouterProvider } from 'react-router-dom'
    import './App.css'
    import router from './router'

    function App() {
      return <RouterProvider router={router} />
    }

    export default App
    ```

- chạy client lên

  ```bash
  npm run dev
  ```

  ta sẽ có `http://localhost:3000/`
  ![Alt text](image-187.png)

  ta sẽ có `http://localhost:3000/login/oauth`
  ![Alt text](image-188.png)

- bây giờ tạo đường link `https://accounts.google.com/......` để khi ngta click vào nó sẽ tiến hành đăng nhập và chọn tài khoản google
- ta sẽ đọc doc ở trang [doc](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow?hl=vi)
  ![Alt text](image-189.png)
  ![Alt text](image-190.png)
  ![Alt text](image-191.png)
- ta sẽ có url là `https://accounts.google.com/o/oauth2/v2/auth`
  và kèm các queryParameter, nên ta sẽ tạo `TwitterClient > .env` để lưu các giá trị query trong document yêu cầu, các giá trị đó được lấy từ file json ta đã tải về
  ![Alt text](image-192.png)

```js
//vì ta xài REACTVITE nên ta phải có prefix là VITE ở trước
VITE_GOOGLE_CLIENT_ID = '1033412508188-jkgme8m537qpbtatt72m0gj5m759fmfl.apps.googleusercontent.com' //ta lấy từ json
VITE_GOOGLE_REDIRECT_URI = 'http://localhost:4000/users/oauth/google' //đây là route ta sẽ tạo bên server của mình
```

- trước tiên ta sẽ tạo hàm khi nhấn vào nút `login with Google`
- vào component `Home.jsx` tạo hàm `getGoogleAuthUrl`

```ts
const getGoogleAuthUrl = () => {
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI } = import.meta.env //import vào .env của Vite
  const url = 'https://accounts.google.com/o/oauth2/v2/auth'
  const query = {
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: VITE_GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(
      ' '
    ), //các quyền truy cập, và chuyển thành chuỗi cách nhau bằng space
    prompt: 'consent' //nhắc người dùng đồng ý cho phép truy cập
    access_type: "offline", //truy cập offline giúp lấy thêm refresh token
  }
  return `${url}?${new URLSearchParams(query)}` //URLSearchParams(hàm có sẵn): tạo ra chuỗi query dạng key=value&key=value để làm query string
}

const googleOAuthUrl = getGoogleAuthUrl()

//ta chuyển nút button của react function component(rfc) Home thành thẻ Link(giống thẻ a), để khi nhấn vào sẽ dẫn đến
<Link to={googleOAuthUrl}>Login with Google</Link>
```

- giờ ta sẽ test thử bằng cách

  - vào của `ch04-twitterProject > src > index.ts > const port = 4000` đổi port về 4000 và chạy server lên, nhớ setting lại host trong postman luôn
  - sau đó chạy twitterClient lên
  - ta sẽ có server: 4000, client : 3000
  - vào trang `http://localhost:3000/` bấm `Login with Google` ta sẽ được dẫn đến
    ![Alt text](image-193.png)
    để chọn account
  - ta chọn account thì hệ thống sẽ redirect ta về `http://localhost:4000/users/oauth/google` của ta đã tạo kèm các query string
    `http://localhost:4000/users/oauth/google?code=4%2F0AfJohXngrQEyzPOoQXMPNuv6eI-a28HUE-oVzpTmn5J-osOGjLIxvFKj0XQMARjYn8Ye9A&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent`

# giờ ta về lại dự án `ch04-twitterProject` và tạo route tương ứng để làm tiếp flow xử lý này

- tạo route `/oauth/google`

  ```ts
  usersRouter.get('/oauth/google', wrapAsync(oAuthController))
  ```

- tạo controller `oAuthController`

  ```ts
  export const oAuthController = async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query // lấy code từ query params
    const result = await usersService.oAuth(code as string) //oAuth tạo sau
    return res.json({
      message: USERS_MESSAGES.LOGIN_SUCCESS,
      result
    })
  }
  ```

- vào `users.services.ts` tạo `getOAuthGoogleToken`và`oAuth`

  ```ts
  //getOAuthGoogleToken dùng code nhận đc để yêu cầu google tạo id_token
    private async getOAuthGoogleToken(code: string) {
      const body = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID, //khai báo trong .env bằng giá trị trong file json
        client_secret: process.env.GOOGLE_CLIENT_SECRET, //khai báo trong .env bằng giá trị trong file json
        redirect_uri: process.env.GOOGLE_REDIRECT_URI, //khai báo trong .env bằng giá trị trong file json
        grant_type: 'authorization_code'
      }
      //giờ ta gọi api của google, truyền body này lên để lấy id_token
      //ta dùng axios để gọi api `npm i axios`
      const { data } = await axios.post(`https://oauth2.googleapis.com/token`, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' //kiểu truyền lên là form
        }
      }) //nhận đc response nhưng đã rã ra lấy data
      return data
    }

    async oAuth(code: string) {
      //dùng code lấy bộ token từ google
      const result = await this.getOAuthGoogleToken(code)
      console.log(result)
    }

  ```

- test lại code và ta sẽ có

  ```js
  {
    access_token: 'ya29.a0AfB_byCvAbZyv2--9_0njauEOPcxIVAzBb-soPKGdgsUNyh527dhcaoub3lOVsHgeSehsjxRNFzKCyxMOcDLcNSXujXXQfCn4ZKdAVHNx3zb2Hqn6i2NBQgrRT5VjiP4xnIske7naQAs_7G7ayS70sr-pPA5tK9WGdW_aCgYKAWUSARESFQGOcNnCyoeQhZw-T1S6oITx7bGY4g0171',
    expires_in: 3599,
    refresh_token: '1//0e1kZbSI9VPBsCgYIARAAGA4SNgF-L9IrguQGrS6efkRi1umaERmggfWas0kzWnS3UIn2oimS6ajXsNXv4028vG7qWO0cGfITTw',
    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
    token_type: 'Bearer',
    id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImI5YWM2MDFkMTMxZmQ0ZmZkNTU2ZmYwMzJhYWIxODg4ODBjZGUzYjkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzOTgwMjQ3Nzk0MzUtYjFydWpwOG9nc2tjcWZmZDU0bmdzM29maHVwaWE1bzcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzOTgwMjQ3Nzk0MzUtYjFydWpwOG9nc2tjcWZmZDU0bmdzM29maHVwaWE1bzcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc5MTc0MzcwMzU2NTg0OTQ4NzAiLCJlbWFpbCI6ImxlaG9kaWVwLjE5OTlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ0b080LTRUTTNJNUUwR1o0MnVtSGNnIiwibmFtZSI6IsSQaeG7h3AgTMOqIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0l0RXRDWGMwb1pibm5veEdUeEJ5aXE0SFJNa3NYTXRyV0lSMkY4a3BsTD1zOTYtYyIsImdpdmVuX25hbWUiOiLEkGnhu4dwIiwiZmFtaWx5X25hbWUiOiJMw6oiLCJsb2NhbGUiOiJ2aSIsImlhdCI6MTY5NjA2NTY5NSwiZXhwIjoxNjk2MDY5Mjk1fQ.s76c9CU9ZoyEQHZDVC9tzvFgRfoDCRnivWhYysvKn0KOHiFMJ47x1kPYWDdmOSgZ3BXQ6g5Bcs6IUzxp2TF0q6SXW1RsRfxjP59yklKbyUOu1NdLeYbYfTywLlGSoBQTNy9IZnFl_4Vq1fJynC70qT5P5FJehhH2fnn85YWOuhYM12dFXiB_C5UsmrkGNyIwLcIHKlRIXZu47ui901gIPJSesc8m0L2BRIZ1tRPmI8rYS1bjMPj6a03yef2Kc_Z3G8-zW14S03Q3ZIQ4SfAMi-K2UnCf4OKWNkp_tRhNBzr1GbBpY0ezmpMZwvE8uQqfQjChSK99nZHBTDw91i_eAQ'
  }
  ```

- ta có thể dùng id_token và decoded thông qua jwt sẽ có đc payload
  ![Alt text](image-194.png)
- ta chỉ cần `email` và `name` là được, còn `password` thì ta sẽ cho random
- giờ ta sẽ vào `users.services.ts` tạo thêm method `getGoogleUserInfo(access_token: string, id_token: string)` :có nhiệm vụ gọi googleApi decode id_token dùng trong method `oAuth`

  ```ts
  //dùng id_token để lấy thông tin của người dùng
  private async getGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo`, {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })
    //ta chỉ lấy những thông tin cần thiết
    return data as {
      id: string
      email: string
      email_verified: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
      locale: string
    }
  }

  //đồng thời fix luôn getOAuthGoogleToken cho tường mình vì mình chỉ cần access_token  và id_token mà thôi
  private async getOAuthGoogleToken(code: string) {
    ...
    return data as {
      access_token: string
      id_token: string
    }
  }
  //xài ở oAuth
  async oAuth(code: string) {
    //dùng code lấy bộ token từ google
    const { access_token, id_token } = await this.getOAuthGoogleToken(code)
    const userInfor = await this.getGoogleUserInfo(access_token, id_token)
    //userInfor giống payload mà ta đã check jwt ở trên
    if (!userInfor.email_verified) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.GMAIL_NOT_VERIFIED, // trong message.ts thêm GMAIL_NOT_VERIFIED: 'Gmail not verified'
        status: HTTP_STATUS.BAD_REQUEST //thêm trong HTTP_STATUS BAD_REQUEST:400
      })
    }
    //kiểm tra email đã đăng ký lần nào chưa bằng checkEmailExist đã viết ở trên
    const user = await databaseService.users.findOne({ email: userInfor.email })
    //nếu tồn tại thì cho login vào, tạo access và refresh token
    if (user) {
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
        user_id: user._id.toString(),
        verify: user.verify
      }) //thêm user_id và verify
      //thêm refresh token vào database
      await databaseService.refreshTokens.insertOne(new RefreshToken({ user_id: user._id, token: refresh_token }))
      return {
        access_token,
        refresh_token,
        new_user: 0 //đây là user cũ
        verify: user.verify
      }
    } else {
      //random string password
      const password = Math.random().toString(36).substring(1, 15)
      //chưa tồn tại thì cho tạo mới, hàm register(đã viết trước đó) trả về access và refresh token
      const data = await this.register({
        email: userInfor.email,
        name: userInfor.name,
        password: password,
        confirm_password: password,
        date_of_birth: new Date().toISOString()
      })
      return {
        ...data,
        new_user: 1 //đây là user mới
        verify: UserVerifyStatus.Unverified
      }
    }
  }

  ```

- trong `.env` thêm `CLIENT_REDIRECT_CALLBACK = 'http://localhost:3000/login/oauth'`
- fix lại return của controller `oAuthController`

  ```ts
  import { config } from 'dotenv'
  config() //để xài đc biến môi trường

  export const oAuthController = async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query // lấy code từ query params
    //tạo đường dẫn truyền thông tin result để sau khi họ chọn tại khoản, ta check (tạo | login) xong thì điều hướng về lại client kèm thông tin at và rf
    const { access_token, refresh_token, new_user } = await usersService.oAuth(code as string)
    const urlRedirect = `${process.env.CLIENT_REDIRECT_CALLBACK}?access_token=${access_token}&refresh_token=${refresh_token}&new_user=${new_user}&verify=${verify}`
    return res.redirect(urlRedirect)
  }
  ```

- nếu làm đúng thì khi login, ta chọn account google xong thì sẽ được redirect về lại client login với query params giống thế này
  `http://localhost:3000/login/oauth?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX0lkIjoiNjRiZjkyMDBmODAzM2RlYjJjMjQ4ZTAyIiwidG9rZW5fdHlwZSI6MCwidmVyaWZ5IjowLCJpYXQiOjE2OTYwOTUxMDAsImV4cCI6MTY5NjA5NjAwMH0.LCfp5xNPEARvn44RD1tzlt2TpZhHuXHjCCKPxOynQok&refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX0lkIjoiNjRiZjkyMDBmODAzM2RlYjJjMjQ4ZTAyIiwidG9rZW5fdHlwZSI6MSwidmVyaWZ5IjowLCJpYXQiOjE2OTYwOTUxMDAsImV4cCI6MTcwNDczNTEwMH0.AS2Kh17hNylNAR7Na5k4zeClnJ0BKmRBpwcMi17m4sw&new_user=false`

- giờ ta qua client và xử lý lưu trữ access_token và refresh_token sau khi đã được điều hướng ở component `Login.jsx`

```ts
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Login() {
  const [params] = useSearchParams() //lấy ra các params trong url
  const navigate = useNavigate() //hàm dùng để chuyển hướng trang
  useEffect(() => {
    const accessToken = params.get('access_token') //lấy ra access_token từ params
    const refreshToken = params.get('refresh_token') //lấy ra refresh_token từ params
    const new_user = params.get('new_user') //lấy ra new_users từ params, để biết có phải lần đầu login hay không
    const verify = params.get('verify') //lấy ra verify từ params
    //verify để biết user này mới hay cũ, đã login nhiều lần nhưng chưa verify thì sao

    console.log({ accessToken, refreshToken, new_user, verify }) //log thử

    localStorage.setItem('accessToken', accessToken) //lưu access_token vào localStorage
    localStorage.setItem('refreshToken', refreshToken) //lưu refresh_token vào localStorage
    //navigate('/') //xem xong thì bật dòng này để chuyển hướng về trang chủ
  }, [params]) //useEffect sẽ chạy lại khi params thay đổi
  return <div>Login</div>
}
```

- fix tý xíu `Home.jsx` để hiển thị đẹp hơn và thêm nút logout

```ts
export default function Home() {
  const isAuthenticated = localStorage.getItem('accessToken') //kiểm tra xem đã có access token hay chưa
  const logout = () => {
    localStorage.removeItem('accessToken') //xóa access token trong localStorage
    localStorage.removeItem('refreshToken') //xóa refresh token trong localStorage
    window.location.reload() //reload lại trang
  }
  return (
    <>
      <div>
        <span>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </span>
        <span>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </span>
      </div>
      <h1>Google OAuth 2.0</h1>

      <p className='read-the-docs'>
        {isAuthenticated ? (
          <>
            <span>Hello, you are logged in</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to={googleOAuthUrl}>Login with Google</Link>
        )}
      </p>
    </>
  )
}
```

- thử test lại xem giao diện đã được cập nhật mỗi lần đăng nhập chưa(xóa localStorage để test lại)
- nếu đăng nhập được ta sẽ có
  ![Alt text](image-195.png)
- lấy localStorage và kiểm tra xem refresh_token có tồn tại trong `collection` không ?
  ![Alt text](image-196.png)
