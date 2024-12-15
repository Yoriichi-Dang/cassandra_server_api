import dbConnection from '@/configs/db'
import { Pool } from 'pg'
import UserLoginData from '../models/user_login_data_model'
import { queryData } from '@/utils/query'
import UserModel from '../models/user_model'
import { UserLoginDataDto } from '../dtos/user_dto'

class AuthRepository {
  private pg: Pool
  constructor() {
    this.pg = dbConnection.getPool()
  }
  createAccount = async (userLoginData: UserLoginDataDto): Promise<number> => {
    const { email, passwordHash, username } = userLoginData
    const client = await this.pg.connect()
    try {
      if (await this.checkEmailAccountExist(email)) {
        return 0
      }
      if (await this.checkUsernameAccountExist(username)) {
        return -1
      }
      await client.query('BEGIN')

      const queryText = 'INSERT INTO users_login_data(email, password_hash) VALUES($1, $2) RETURNING id'
      const result = await client.query(queryText, [email, passwordHash])
      const userId = result.rows[0].id
      const queryText2 = 'INSERT INTO users_account(user_id, username) VALUES($1, $2)'
      await client.query(queryText2, [userId, username])
      await client.query('COMMIT')
      return userId
    } catch (e) {
      await client.query('ROLLBACK')
      throw new Error('Internal server error ' + e)
    } finally {
      client.release()
    }
  }
  checkEmailAccountExist = async (email: string): Promise<boolean> => {
    const queryText = 'SELECT * FROM users_login_data WHERE email = $1'
    const result = await queryData(this.pg, queryText, [email])
    return result.length == 1
  }
  checkUsernameAccountExist = async (username: string): Promise<boolean> => {
    const queryText = 'SELECT * FROM users_account WHERE username = $1'
    const result = await queryData(this.pg, queryText, [username])
    return result.length == 1
  }
  findUserByEmail = async (email: string): Promise<UserLoginData | null> => {
    const queryText =
      'SELECT * FROM users_login_data JOIN users_account ON users_login_data.id=users_account.user_id WHERE email = $1'
    const result: UserModel[] = await queryData(this.pg, queryText, [email])
    if (result.length == 0) {
      return null
    }
    const userLoginData: UserLoginData = {
      id: result[0].id || '',
      email: result[0].email,
      passwordHash: result[0]['password_hash'] || '',
      username: result[0].username
    }
    return userLoginData
  }
}
export default AuthRepository
