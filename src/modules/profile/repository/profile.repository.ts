import dbConnection from '@/configs/db'
import UserModel from '@/modules/auth/models/user_model'
import { queryData } from '@/utils/query'
import { Pool } from 'pg'
import UserDto from '../dtos/user_dto'
import PostModel from '@/modules/posts/models/post_model'
import AuthRepository from '@/modules/auth/repository/auth.repository'

class ProfileRepository {
  private db: Pool
  private authRepository: AuthRepository

  constructor() {
    this.db = dbConnection.getPool()
    this.authRepository = new AuthRepository()
  }
  findProfile = async (id: string) => {
    const query = `
        SELECT * 
        FROM users_account ua
        JOIN users_login_data uld 
        ON ua.id = uld.id 
        WHERE uld.id = $1
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
        phone: result[0].phone,
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
  updateProfile = async (id: string, profile: Partial<UserDto>): Promise<number> => {
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
        WHERE user_id = $8
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
      await client.query('BEGIN')
      await client.query(query, values)
      return 1
    } catch (error) {
      client.query('ROLLBACK')
      return -1
    } finally {
      client.release()
    }
  }
  updateProfileImage = async (id: string, imageUrl: string): Promise<number> => {
    const client = await this.db.connect()
    const query = `
        UPDATE users_account
        SET avatar_url = $1
        WHERE id = $2
        `
    const values = [imageUrl, id]
    try {
      await client.query('BEGIN')
      await client.query(query, values)
      return 1
    } catch (error) {
      client.query('ROLLBACK')
      return -1
    } finally {
      client.release()
    }
  }
  updatePhoneEmail = async (id: string, profile: Partial<UserDto>): Promise<number> => {
    const client = await this.db.connect()
    const oldProfile = await this.findProfile(id)
    if (!oldProfile) {
      throw new Error('User not found')
    }
    if (profile.email && (await this.authRepository.checkEmailAccountExist(profile.email))) {
      return -1
    }
    const query = `
        UPDATE users_login_data
        SET 
          email = $1,
          phone = $2,
          updated_at = NOW()
        WHERE id = $3
          `
    const values = [profile.email || oldProfile.email, profile.phone || oldProfile.phone, id]
    try {
      await client.query('BEGIN')
      await client.query(query, values)
      await client.query('COMMIT')
      return 1
    } catch (error) {
      client.query('ROLLBACK')
      throw new Error(String(error))
    } finally {
      client.release()
    }
  }
  updateUsername = async (id: string, username: string): Promise<number> => {
    const client = await this.db.connect()
    const oldProfile = await this.findProfile(id)
    if (!oldProfile) {
      throw new Error('User not found')
    }
    if (oldProfile.username === username) {
      return 1
    }
    if (username && (await this.authRepository.checkUsernameAccountExist(username))) {
      return -1
    }

    const query = `
        UPDATE users_account
        SET 
          username = $1,
          updated_at = NOW()
        WHERE user_id = $2
          `
    const values = [username, id]
    try {
      await client.query('BEGIN')
      await client.query(query, values)
      await client.query('COMMIT')
      return 1
    } catch (error) {
      client.query('ROLLBACK')
      return -1
    } finally {
      client.release()
    }
  }
  getUserPosts = async (id: string): Promise<PostModel[] | null> => {
    const query = `
        select p.id,p.content,p.image_url,p.caption
        from posts p inner join user_posts up on p.id=up.post_id
        where  up.user_id=$1
        `
    const values = [id]
    try {
      const result = await queryData<PostModel>(this.db, query, values)
      if (result.length === 0) {
        return null
      }
      return result
    } catch (error) {
      throw new Error(String(error))
    }
  }
}
export default ProfileRepository
