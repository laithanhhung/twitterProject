import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb'
import { config } from 'dotenv' //để đọc các biến môi trường từ file .env từ thư viện dotenv
import User from '~/models/schemas/User.schema'
config() //đọc file .env
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@tweetprojectk18f3.zsbm40o.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(`${process.env.DB_NAME}`)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Lỗi trong quá trình kết nối đến MongoDB', error)
      throw error //ném tất cả lỗi vào nơi tập trung lỗi để xử lý cho dễ dàng
    }
  }
  get users(): Collection<User> {
    //chuyển Document thành User
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()

export default databaseService
