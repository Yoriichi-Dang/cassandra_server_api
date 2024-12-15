import dbConnection from '@/configs/db'
import UserModel from '@/modules/auth/models/user_model'
import { queryData } from '@/utils/query'
import { Pool } from 'pg'

class FollowRepository {
  private db: Pool
  constructor() {
    this.db = dbConnection.getPool()
  }
  getListFollowers = async (userId: string): Promise<UserModel[]> => {}
  getListFollowing = async (userId: string): Promise<UserModel[]> => {}
  checkFollow = async (followerId: string, followingId: string): Promise<boolean> => {
    const query = `
            SELECT * 
            FROM "user_follows"
            WHERE "user_id" = $1 AND "user_following_id" = $2
        `
    const values = [followerId, followingId]
    const res = await queryData(this.db, query, values)
    return res.length > 0
  }
  getFollowCount = async (userId: string): Promise<{ following: number; follower: number }> => {
    try {
      const queryText = `
      SELECT 
        COALESCE((SELECT COUNT(*) FROM user_follows uf WHERE uf.user_id = $1), 0) AS following,
        COALESCE((SELECT COUNT(*) FROM user_follows uf WHERE uf.user_following_id = $1), 0) AS follower;
    `

      // Chuyển userId thành number nếu cần thiết (giả sử userId là string, bạn cần chắc chắn rằng cơ sở dữ liệu yêu cầu kiểu dữ liệu gì)
      const values = [parseInt(userId, 10)]

      // Truy vấn dữ liệu
      const resFollowing = await queryData<{ following: number; follower: number }>(this.db, queryText, values)

      // Trả về số lượng following và follower
      return {
        following: resFollowing[0]?.following ?? 0,
        follower: resFollowing[0]?.follower ?? 0
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error('Error fetching follow count:', error)
      throw new Error('Failed to fetch follow count')
    }
  }

  followUser = async (followerId: string, followingId: string): Promise<number> => {
    const client = await this.db.connect()
    try {
      await client.query('BEGIN')
      const query = `
            INSERT INTO "user_follows" ("user_id", "user_following_id")
            VALUES ($1, $2)
            RETURNING "id"
        `
      const values = [followerId, followingId]
      const res = await client.query(query, values)
      await client.query('COMMIT')
      return res.rows[0].id
    } catch (e) {
      await client.query('ROLLBACK')
      console.error('Error in followUser:', e)
      return -1
    } finally {
      client.release()
    }
  }
  unFollowUser = async (followerId: string, followingId: string): Promise<number> => {
    const client = await this.db.connect()
    try {
      await client.query('BEGIN')
      const query = `
                DELETE FROM "user_follows"
                WHERE "user_id" = $1 AND "user_following_id" = $2
            `
      const values = [followerId, followingId]
      await client.query(query, values)
      await client.query('COMMIT')
      return 1
    } catch (e) {
      await client.query('ROLLBACK')
      console.error('Error in unFollowUser:', e)
      return -1
    } finally {
      client.release()
    }
  }
}
export default FollowRepository
