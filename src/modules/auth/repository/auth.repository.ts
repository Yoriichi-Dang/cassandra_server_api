import dbConnection from '@/configs/db'
import { Pool } from 'pg'
import UserLoginData from '../models/user_login_data_model'
import { queryData } from '@/utils/query'

class AuthRepository {
  private pg: Pool
  constructor() {
    this.pg = dbConnection.getPool()
  }
  createAccount = async (userLoginData: UserLoginData) => {
    const { email, passwordHash, username } = userLoginData
    try {
      const queryText = 'INSERT INTO users_login_data(email, password_hash, username) VALUES($1, $2, $3) RETURNING id'
      const result = await queryData(this.pg, queryText, [email, passwordHash, username])
      return result[0]
    } catch (e) {
      return null
    }
  }
  checkAccountExist = async (email: string): Promise<boolean> => {
    const client = await this.pg.connect()
    try {
      const queryText = 'SELECT * FROM users_login_data WHERE email = $1'
      const result = await queryData(this.pg, queryText, [email])
      return result.length == 1
    } finally {
      client.release()
    }
  }
}
export default AuthRepository
