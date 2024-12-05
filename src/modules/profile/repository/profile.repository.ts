import dbConnection from '@/configs/db'
import UserModel from '@/modules/auth/models/user_model'
import { queryData } from '@/utils/query'
import { Pool } from 'pg'
import UserDto from '../dtos/user_dto'

class ProfileRepository {
  private db: Pool
  constructor() {
    this.db = dbConnection.getPool()
  }
  findProfile = async (id: string) => {
    const query = `
        SELECT * 
        FROM users_account ua
        JOIN users_login_data uld 
        ON ua.id = uld.id 
        WHERE ua.id = $1
        `
    const values = [id]
    try {
      const result = await queryData<UserModel>(this.db, query, values)
      if (result.length === 0) {
        return null
      }
      if (!result[0] || typeof result[0] !== 'object') {
        throw new Error('Invalid result format')
      }
      const userModel: UserModel = {
        id: result[0].id,
        email: result[0].email,
        username: result[0].username,
        avatar_url: result[0].avatar_url,
        full_name: result[0].full_name,
        district: result[0].district,
        province: result[0].province,
        address: result[0].address,
        day_of_birth: result[0].day_of_birth,
        gender: result[0].gender,
        description: result[0].description,
        password_hash: result[0].password_hash,
        created_at: result[0].created_at,
        updated_at: result[0].updated_at
      }
      return userModel
    } catch (error) {
      throw new Error(String(error))
    }
  }
  updateProfile = async (id: string, profile: Partial<UserDto>): Promise<boolean> => {
    const client = await this.db.connect()
    const oldProfile = await this.findProfile(id)
    if (!oldProfile) {
      throw new Error('User not found')
    }
    const query = `
        UPDATE users_account
        SET 
          full_name = $1,
          district = $2,
          province = $3,
          address = $4,
          day_of_birth = $5,
            gender = $6,
            description = $7,
            updated_at = NOW()
        WHERE id = $8
          `
    const values = [
      profile.full_name || oldProfile.full_name,
      profile.district || oldProfile.district,
      profile.province || oldProfile.province,
      profile.address || oldProfile.address,
      profile.day_of_birth || oldProfile.day_of_birth,
      profile.gender || oldProfile.gender,
      profile.description || oldProfile.description,
      id
    ]
    try {
      await client.query(query, values)
      client.release()
      return true
    } catch (error) {
      throw new Error(String(error))
    }
  }
  updateProfileImage = async (id: string, imageUrl: string): Promise<boolean> => {
    const client = await this.db.connect()
    const query = `
        UPDATE users_account
        SET avatar_url = $1
        WHERE id = $2
        `
    const values = [imageUrl, id]
    try {
      await client.query(query, values)
      client.release()
      return true
    } catch (error) {
      throw new Error(String(error))
    }
  }
}
export default ProfileRepository
