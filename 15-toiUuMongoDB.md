# I - index trong mongoDB là gì ?

- để demo phần này ta vào mongoDB Compass tạo 1 database mới
  ![Alt text](image-240.png)
- sau đó vào index code nhanh đoạn này vào cuối file để tạo ra data giả cho collections `users`

  ```ts
  const mgclient = new MongoClient(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.zhww2g8.mongodb.net/?retryWrites=true&w=majority`
  )

  //try cập vào db earth
  const db_earth = mgclient.db('earth')
  //truy cap65 vào collection users
  const users = db_earth.collection('users')

  //tạo giả 1000 user
  function getRandomAge() {
    return Math.floor(Math.random() * 100) + 1
  }

  const usersData = []
  for (let i = 0; i < 1000; i++) {
    usersData.push({
      name: `user ${i + 1}`,
      age: getRandomAge(),
      sex: i % 2 == 0 ? 'male' : 'female'
    })
  }

  //nhét mảng vào database
  users.insertMany(usersData)
  ```

- sau đó `npm run dev`, xong thì tắt
- xóa đoạn code trên trong index.ts và kiểm tra collections `users` của database `earth`
  ![Alt text](image-241.png)

- khi mà ta search `name: "user 10"`
  ![Alt text](image-242.png)
- thì mặc định nó sẽ đi qua 1000 thằng trong users mới ra kết quả
  ![Alt text](image-243.png)
- nếu mà ta muốn tìm ít hơn thì vào option chọn limit là 1
  ![Alt text](image-244.png)
  lúc này nó sẽ chạy từ đầu danh sách đến chỗ cần tìm
  ![Alt text](image-245.png)
- nếu mà mình tìm bằng \_id thì nó rất nhanh, vì \_id là index của collections users
  ![Alt text](image-246.png)
  ![Alt text](image-247.png)
- nếu ta thường xuyên xài name để query thì ta có thể thêm name task index
  ![Alt text](image-248.png)
  mặc dù index làm tốn dung lượng bộ nhớ của ta, nhưng nó mang lại khả năng query nhanh
  ![Alt text](image-249.png)
  từ đó, nếu ta query name thì sẽ rất nhanh
  ![Alt text](image-250.png)
  ![Alt text](image-251.png)

# II - compound index (composite index - index nhiều trường cùng lúc)

- mặc định \_id là index mặc định của mongodb
- và ta vừa tạo thêm index là name
- nếu giờ ta tìm `{age: 30, sex:"female"}` thì nó vẫn sẽ chạy từ đầu đến cuối danh sách
  ![Alt text](image-252.png)
- nếu mình dùng `age` làm `index` ta sẽ thấy tốc độ tìm kiếm giảm đáng kể
  ![Alt text](image-253.png)
  ![Alt text](image-254.png)
- nếu mà mình thêm `sex` làm `index` luôn thì không có tăng thêm hiệu năng
- nếu mình xóa `index age` đi và dùng `sex` thì ta sẽ thấy hiệu năng giảm so với dùng riêng `age`, vì giới tính chỉ có `nam nữ` được chia đều cho `1000`, còn `tuổi` thì k phải ai cũng có `30 tuổi`
- vậy nếu phải chọn 1 trong 2 làm index thì ta chọn `age`
- nhưng vẫn có cách để ta dùng cả 2 index cùng lúc, đó là compound index
  - xóa index sex và age
    ![Alt text](image-255.png)
  - tạo compound index
    ![Alt text](image-259.png)
  - kết quả là tìm rất nhanh
    ![Alt text](image-257.png)
- vậy khi compound index rồi, thì ta có cần index cho các field thành phần không ? câu trả lời là , nếu hay dùng filed nào thì vẫn nên

# III - sắp xếp tăng dần và giảm dần

- nếu bây giờ ta query `{age: {$lt: 30}, sex:"female"}` : `$lt` là `less than`: bé hơn
  ![Alt text](image-258.png)
- thì ta sẽ thấy kết quả được sắp xếp tuổi theo chiều tăng dần
- nếu ta xóa compound key vừa tạo, và tạo lại là
  ![Alt text](image-260.png)
- thì kết quả sẽ mặc định là giảm dần theo tuổi
- nhưng rỏ rằng là ta có thể sort bằng option mà ?
  `{name: 1} hoặc {name: -1}` là được
  ![Alt text](image-261.png)
- tuy có thể chỉnh như vậy, nhưng nếu để mặc định thì nó sẽ đỡ phải sort nhiều hơn

# IV - Index Text

tìm user 3 và thêm address
![Alt text](image-262.png)
lúc này ta sẽ có
![Alt text](image-263.png)
ta có thể tìm kiểm document bằng text nào đó `{$text: {$search: "TP HCM"}}`
![Alt text](image-264.png)
ta sẽ bị yêu cầu phải có text index, giờ ta tạo
![Alt text](image-265.png)
như vậy là ta đã cho phép client tìm kiếm thông tin text qua adress
vậy nên nếu ta tìm thì sẽ được
![Alt text](image-266.png)
nhưng tìm user 3 thì k đc, vì ta chưa cho phép tìm text trong field name
![Alt text](image-267.png)
nên ta tạo index text cho name
![Alt text](image-268.png)
nhưng như vậy sẽ không được, vì **quy ước rằng trong 1 collection chỉ đc phép có 1 index text thôi**
nên ta sẽ` xóa address text`, và tạo` compound index text cho name và address`
![Alt text](image-269.png)
kết quả thu được , `còn nếu ta chỉ`"user 3"`thì nó tìm tất cả name có chữ "user" bên trong
![Alt text](image-271.png)

nếu `\"content\"` là tìm tuyệt đối giá trị trong cụm,
![Alt text](image-270.png)

# V - thao tác dùng lệnh bằng mongoSH

- xem danh sách các index trong users

  ```bash
    use earth
    db.users.getIndexes()
  ```

- tạo index thì cho name giảm dần

  ```bash
  db.users.createIndex({name: -1})
  ```

  ![Alt text](image-274.png)

- muốn xóa thì

  ```bash
  db.users.dropIndex('name_-1')
  ```

  ![Alt text](image-275.png)
  ![Alt text](image-276.png)

- trong này chỉ xóa thêm, xóa, k có chỉnh sữa nhen

# ưu và nhược điểm của index

- ưu: tăng tốc độ truy vấn nhờ vào việc tạo chỉ mục riêng
- nhược: tốn thời gian thêm xóa, sữa vì mongoDB sẽ cập nhật lại chỉ mục liên quan, quá trình này tốn tài nguyên và thời gian hơn bình thường
- 1 collection chỉ có tối đa 64 index

- một số loại index collection

  - \*single field index
  - \*compound index
  - \*text index : `chỉ đc 1 cái thôi`
  - \*multikey index

  - geospatial index
  - hashed index
  - unique index
  - sparse index
  - TTL index
  - wildcard index

# index và các trường trong collection users

- ta quay lại dự án tweet của chúng ta
- trong collection users ta có các trường nào cần trở thành index ?
- chỉ cần đọc và xem thử ta query nhiều nhất trường nào thì tạo index cho trường đó
- \_id, email & password, email, username

- thay vì setup bằng mongoSH thì ta sẽ setup bằng code
- vào file `database.services.ts` code thêm

```ts
  async indexUsers() {
    // unique để tìm kiếm không trùng username và email
    await this.users.createIndex({ username: 1 }, { unique: true })
    await this.users.createIndex({ email: 1 }, { unique: true })
    await this.users.createIndex({ email: 1, password: 1 })
  }
  async connect() {
    ...
```

- giờ ta muốn chạy hàm `indexUsers` để tạo index
- nếu ta gọi hàm trong hàm `connect` không hay, vì như vậy hàm `connect` sẽ không làm đúng chức năng của nó
- nhiệm vụ của nó là `connect` mà thôi, nên ta sẽ tìm chỗ nào gọi hàm `connect` và sau đó sẽ chạy tiếp hàm `indexUsers` vì `connect` là 1 promise

- ta vào `index.ts` sẽ thấy dòng `databaseService.connect()` và ta sẽ `then` tiếp hàm `indexUsers`

  ```ts
  databaseService.connect().then(() => {
    databaseService.indexUsers()
  })
  ```

chúng ta sẽ thấy ta bị lỗi `duplicate key error collection { username: "" }`
![Alt text](image-277.png)

đó là bởi vì lúc xây dựng dự án bán đầu ta không có tự render ra username, nên nó có nhiều doc chứa username là " ", nhưng sau này ta đã có hết rồi, nên ta sẽ vào mongoDB xóa hết các doc có username là " " đi

- vào mongoSH gõ

  ```bash
  use twitter-dev
  db.users.deleteMany({username: ""})
  ```

  vậy là k còn nữa
  ![Alt text](image-278.png)

- lưu lại và xem thử app của mình đã hoạt động chưa

#V - fix bug refresh token:

## vấn đề 1

- khi ta dùng chức năng `refreshtoken` thì ta sẽ gữi `refresh_token cũ` lên và yêu cầu server tạo ra `refresh_token mới`
- nhiệm vụ của ta là làm sao để `refresh_token mới` có cùng ngày hết hạn với `refresh_token cũ`

### tìm hiểu giải pháp

- giờ ta login
  ![Alt text](image-279.png)
- dùng `refresh_token` và decode để xem `payload`
  ![Alt text](image-280.png)
- ở đây nếu ta bỏ `123!@#2` vào verify Signature thì ta sẽ được từ đó biết được `refresh_token` này có phải mình tạo ra không
  `123!@#2` là password mà ta đã lưu trong `.env`
  ![Alt text](image-281.png)

- giờ ta xem payload có gì

  ```json
  {
    "user_id": "6514f5ba0b5a27781349fcd6",
    "token_type": 1,
    "verify": 1,
    "iat": 1697178204,
    "exp": 1705818204
  }
  ```

- `iat` là `issued at` : thời điểm tạo ra token
- `exp` là `expired at` : thời điểm hết hạn token

- vậy quy tắc là `refresh_token mới` trong `payload` phải có `exp` cùng giá trị với `refresh_token cũ`

### xử lý

- vào `User.requests.ts` để thêm `exp` và `iat` vào `TokenPayload` để khi xài nó sẽ nhắc ta có thuộc tính exp

  ```ts
  export interface TokenPayload extends JwtPayload {
    user_id: string
    token_type: TokenType
    verify: UserVerifyStatus
    exp: number
    iat: number
  }
  ```

- vậy ta vào `users.controllers.ts > refreshTokenController` để xử lý

  ```ts
  export const refreshTokenController = async (
    ...
    //sau khi decode `refreshtoken cũ` ta lấy `exp` ra
    const { user_id, verify , exp} = req.decoded_refresh_token as TokenPayload
    ...
    //truyền thêm `exp` vào `usersService.refreshToken`
    const result = await usersService.refreshToken(user_id, verify, refresh_token, exp)
    ...
  }
  ```

- vào `users.services.ts > refreshToken` để xử lý

  ```ts
  //thêm exp vào param
  async refreshToken(user_id: string, verify: UserVerifyStatus, refresh_token: string, exp: number) {
      const [new_access_token, new_refresh_token] = await Promise.all([
        this.signAccessToken({
          user_id: user_id,
          verify
        }),
        this.signRefreshToken({
          user_id: user_id,
          verify,
          exp//thêm vào hàm signRefreshToken
        })
      ])
      ...
  }
  ```

- vậy nên ta phải code lại hàm `signRefreshToken`

  ```ts
    private signRefreshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
      if (exp) {//nếu có thì truyền vào
        return signToken({
          payload: { user_id, token_type: TokenType.RefreshToken, verify, exp },
          privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string //thêm
        })
      } else {
        return signToken({//nếu không thì thêm options expiresIn: số ngày hết hạn
          payload: { user_id, token_type: TokenType.RefreshToken, verify },
          options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN },
          privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string //thêm
        })
      }
    }

  ```

- test code
  - login
    ![Alt text](image-282.png)
  - lấy refresh_token kiểm tra payload
    ```json
    {
      "user_id": "6514f5ba0b5a27781349fcd6",
      "token_type": 1,
      "verify": 1,
      "iat": 1697181021,
      "exp": 1705821021
    }
    ```
  - xài api refresh_token
    ![Alt text](image-283.png)
  - lấy refresh_token kiểm tra payload
    ```json
    {
      "user_id": "6514f5ba0b5a27781349fcd6",
      "token_type": 1,
      "verify": 1,
      "exp": 1705821021,
      "iat": 1697181049
    }
    ```
- `exp` trước và sau giống nhau là thành công

## vấn đề 2:

- trong collection refresh_tokens ta có các trường `\_id, token ,created_at ,user_id`
- nhưng giờ ta muốn thêm trường `iat` và `exp` để tiện việc quản lý khi nào token nào hết hạn
  - _nhớ rằng nên lưu kiểu date để mongoDB tiện xử lý thay vì lưu như number_
- vậy ta phải vào `RefreshTokens.schema.ts` và fix lại schema

  ```ts
  interface RefreshTokenType {
    _id?: ObjectId
    token: string
    created_at?: Date
    user_id: ObjectId
    iat: number //thêm
    exp: number //thêm
  }
  //cứ cho người dùng truyền number

  export default class RefreshToken {
    _id?: ObjectId
    token: string
    created_at: Date
    user_id: ObjectId
    iat: Date //thêm
    exp: Date //thêm
    //khi tạo mình sẽ convert từ number sang date
    constructor({ _id, token, created_at, user_id, iat, exp }: RefreshTokenType) {
      this._id = _id
      this.token = token
      this.created_at = created_at || new Date()
      this.user_id = user_id
      this.iat = new Date(iat * 1000) //convert từ Epoch time sang Date
      this.exp = new Date(exp * 1000) //convert từ Epoch time sang Date
    }
  }
  ```

- khi làm xong thì `users.services.ts` sẽ báo lỗi, vì ta dùng `class RefreshToken` trong file đó, nên giờ mình sẽ vào file đó để xử lý

  - trong `jwt.ts` có hàm `verifyToken` dùng để `decode_token` lấy `payload`
  - hàm `verifyToken` thường được dùng trong `middleware` để xác thực `token`
    vd middleware đang dùng: `accessTokenValidator`, `refreshTokenValidator`.
  - nên ở tầng `service` ta chưa từng dùng hàm `verifyToken` để xác thực `token` và lấy `payload`
  - giờ trong `users.services.ts` có rất nhiều chỗ lỗi do ta dùng `class RefreshToken` và bị thiếu `iat` và `exp`
  - mà `iat` và `exp` thì ta chỉ có thể lấy được khi dùng `verifyToken` để decode token
  - nên ta sẽ dùng hàm `verifyToken` để tạo ra hàm `decodeRefreshToken` ở trong `users.services.ts` dùng để decode `refresh_token` và lấy `iat` và `exp` truyền vào constructor của `class RefreshToken`

  ```ts
  private decodeRefreshToken(refresh_token: string) {
    //hàm nhận vào token và secretOrPublicKey sẽ return về payload
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  //ta k async await vì, kiểu gì hàm cũng trả về 1 promise
  //nên ta sẽ await khi gọi hàm này

  //fix hàm register
  async register(payload: RegisterReqBody) {
    ....
    //khi tạo acc ta sẽ tạo access_token và refresh_token
    //ta liền decode refresh_token vừa tạo để lấy iat và exp
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    //lưu lại refreshToken, iat, exp và collection refreshTokens mới tạo và nhét vào
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )
    ....
  }

  //fix hàm login
  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    ...
    //khi login ta sẽ tạo access_token và refresh_token để đưa cho client
    //decode refresh_token để lấy vừa tạo để lấy iat và exp
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )
    ...
  }

  //fix hàm verifyEmail
  async verifyEmail(user_id: string) {
  ...
    //khi verifyEmail ta sẽ tạo access_token và refresh_token để đưa cho client giúp họ đăng nhập sau khi verify email
    //decode refresh_token để lấy vừa tạo để lấy iat và exp
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )
  ...
  }

  //fix hàm oAuth
  async oAuth(code: string) {
    ...
    //khi oAuth ta sẽ tạo access_token và refresh_token để đưa cho client
    //decode refresh_token để lấy vừa tạo để lấy iat và exp
      const { iat, exp } = await this.decodeRefreshToken(refresh_token)
      await databaseService.refreshTokens.insertOne(
        new RefreshToken({ user_id: user._id, token: refresh_token, iat, exp })
      )
    ...
  }

  //fix hàm refreshToken
  async refreshToken(user_id: string, verify: UserVerifyStatus, refresh_token: string, exp: number) {
    ...
    //vì sợ exp bị trùng param nên ta đổi tên nó, nhưng thật ra 2 đứa nó là 1
    const { iat, exp: oldExp } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshTokens.deleteOne({ token: refresh_token }) //xóa refresh
    //insert lại document mới
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: new_refresh_token, iat, exp: oldExp })
    )
    ...
  }

  ```

- test
- login thử sẽ bị lỗi
- vì khi login là tạo mới `refresh_token` mà bây giờ mình truyền lên thì lại có thêm `iat` và `exp`
- nó sẽ bị dính tầng validator của mongodb do ta setup trước đó, không cho truyền thêm trường dữ liệu khác
- ta chỉ cần thêm 2 trường đó vào mongoDB
  ![Alt text](image-284.png)
- đã thành công
  ![Alt text](image-285.png)
  ![Alt text](image-286.png)

# tạo các index cho các collection khác

### tạo `index` cho collection `refresh-token`

- trong collections `refresh-token` ta có dùng prop `token` để tìm kiếm, nên:
  - ta sẽ tạo index cho nó
  - trong mongodb còn có co chế ttl index là tự động rà soát mỗi 60s và xóa document khi hết hạn, rất phù hợp để dùng cho bài toán `xóa các refresh token đã hết hạn`, ta có thể tham khảo [doc](https://www.mongodb.com/docs/manual/core/index-ttl/#create-a-ttl-index)
- ta tiền hành thêm index, trong `database.services.ts` tạo hàm `indexRefreshTokens`

  ```ts
  async indexRefreshTokens() {
    this.refreshTokens.createIndex({ token: 1 })
    //đây là ttl index , sẽ tự động xóa các document khi hết hạn của exp
    this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
  }

  //trong file index.ts fix lại hàm connect
  databaseService.connect().then(() => {
    databaseService.indexUsers()
    databaseService.indexRefreshTokens()
  })
  ```

### tạo `index` cho collection `followers`

- ta thường tìm kiếm bằng cặp user_id và follower_id, nên ta sẽ tạo compound index cho 2 trường này
  trong `database.services.ts` tạo hàm `indexRefreshTokens`

```ts
  async indexFollowers() {
    this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
  }
  //trong file index.ts fix lại hàm connect
  databaseService.connect().then(() => {
    databaseService.indexUsers()
    databaseService.indexRefreshTokens()
    databaseService.indexFollowers()
  })
```

### tối ưu index khi khởi động server

- ta có thế thấy ở chỗ dùng hàm connect

```ts
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexFollowers()
})
```

mỗi lần ta `run dev` thì nó sẽ tạo lại index , ta có thể xử lý bằng cách
thêm vào các hàm lần lượt như sau

```ts
  async indexUsers() {
    const exists = await this.users.indexExists(['_id_', 'email_1', 'email_1_password_1', 'username_1'])
    if (exists) return
    ...
  }

  async indexRefreshTokens() {
    const exists = await this.refreshTokens.indexExists(['token_1', 'exp_1'])
    if (exists) return
    ...
  }

  async indexFollowers() {
    const exists = await this.followers.indexExists(['user_id_1_followed_user_id_1'])
    if (exists) return
    ...
  }
```

### các cách tối ưu khác

- dùng mongoDB Driver thay cho các ODM(ORM) như mongoose, Prisma, ...
- Đặt server và database cùng 1 vùng địa lý (cùng server ở hcm chẳng hạn)
- _ODM là các thư viện giúp ta tương tác với mongoDB dễ dàng hơn, nhưng nó sẽ tốn thêm tài nguyên và thời gian_
- _ORM là viết tắt của Object Relational Mapping, là một kỹ thuật lập trình cho phép chúng ta truy cập vào cơ sở dữ liệu quan hệ bằng các đối tượng và thuộc tính của chúng. Nó cho phép chúng ta truy cập vào cơ sở dữ liệu mà không cần viết câu lệnh SQL._
