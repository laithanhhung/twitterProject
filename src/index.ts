import express, { Response, Request, NextFunction } from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaulltErrorHandler } from './middlewares/error.middlewares'
const app = express()
const port = 3000
app.use(express.json()) //middleware
databaseService.connect() //khi chạy thì sẽ bắt đầu kết nối đến database
//localhost:3000/
app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', userRouter)
//localhost:3000/users/tweets
//vào được useRouter -> /users chạy middleware -> /tweets vào được controller (Có data)
//users bộ những api liên quan đến user

app.use(defaulltErrorHandler)

app.listen(port, () => {
  console.log(`Project twitter này đang chạy trên post ${port}`)
})
