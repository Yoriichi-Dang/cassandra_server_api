import dbConnection from '@/configs/db'
import { Pool } from 'pg'
import PostModel from '../models/post_model'
import UserPostModel from '../models/user_post_model'
import UserModel from '@/modules/auth/models/user_model'
import { queryData } from '@/utils/query'

class PostRepository {
  private pg: Pool
  constructor() {
    this.pg = dbConnection.getPool()
  }
  /**
   * Creates a new post associated with a user.
   * @param userId - ID of the user creating the post.
   * @param content - Content of the post.
   * @param imageUrl - (Optional) URL of the image.
   * @param caption - (Optional) Caption for the post.
   * @returns The created Post object.
   */
  createPost = async (postModel: PostModel): Promise<number> => {
    const client = await this.pg.connect()
    try {
      await client.query('BEGIN')
      const insertPostText =
        'INSERT INTO posts(content, image_url, caption) VALUES($1, $2, $3) RETURNING  "id", "content", "image_url", "caption", "created_at", "updated_at"'
      const insertPostValues = [postModel.content, postModel.image_url || null, postModel.caption || null]
      const resPost = await client.query(insertPostText, insertPostValues)
      const post = resPost.rows[0]
      const insertUserPostText = `
        INSERT INTO "user_posts" ("user_id", "post_id")
        VALUES ($1, $2)
        RETURNING "id", "user_id", "post_id", "created_at", "updated_at"
      `
      const insertUserPostValues = [postModel.user_id_post, post.id]
      const resUserPost = await client.query(insertUserPostText, insertUserPostValues)
      const userPost = resUserPost.rows[0]
      const insertPostStateText = `
        INSERT INTO "post_state" ("id", "state") VALUES ($1, $2)
        `
      if (postModel.state == 'all') {
        const insertPostStateValues = [post.id, postModel.state]
        await client.query(insertPostStateText, insertPostStateValues)
      } else if (postModel.state == 'private') {
        const insertPostStateValues = [post.id, 'private']
        await client.query(insertPostStateText, insertPostStateValues)
      } else {
        const insertPostStateValues = [post.id, 'follower']
        await client.query(insertPostStateText, insertPostStateValues)
      }
      await client.query('COMMIT')
      return userPost.id
    } catch (e) {
      await client.query('ROLLBACK')
      console.error('Error in createPost:', e)
      return -1
    } finally {
      client.release()
    }
  }
  getPostById = async (postId: string): Promise<UserPostModel | null> => {
    const queryText = `
   select p.id,p.content,p.image_url,p.caption,up.user_id,uld.email,uld.phone,ua.full_name,ua.username,ua.avatar_url,ua.address,ua.address,ua.district,ua.province,ua.day_of_birth,ua.gender,ua.description
    from posts p inner join user_posts up on p.id=up.post_id
    inner join users_account ua on up.user_id=ua.user_id
    inner join users_login_data uld on ua.user_id=uld.id
    where p.id=$1

    `
    const result = await this.pg.query(queryText, [postId])
    if (result.rows.length === 0) {
      return null
    }
    const post: PostModel = {
      id: result.rows[0].id,
      content: result.rows[0].content,
      image_url: result.rows[0].image_url,
      caption: result.rows[0].caption
    }
    const user: UserModel = {
      id: result.rows[0].user_id,
      email: result.rows[0].email,
      phone: result.rows[0].phone,
      full_name: result.rows[0].full_name,
      username: result.rows[0].username,
      avatar_url: result.rows[0].avatar_url,
      address: result.rows[0].address,
      district: result.rows[0].district,
      province: result.rows[0].province,
      day_of_birth: result.rows[0].day_of_birth,
      gender: result.rows[0].gender,
      description: result.rows[0].description
    }
    const userPost: UserPostModel = {
      post: post,
      userPost: user
    }
    return userPost
  }
  getAllPostByUserId = async (userId: string): Promise<UserPostModel[]> => {
    const queryText = `
    SELECT posts.*,ua.*
    FROM posts
    INNER JOIN user_posts up ON up.post_id = posts.id
    INNER JOIN users_account ua ON up.user_id = ua.user_id
        WHERE posts.id IN (
    SELECT post_state.id
    FROM post_state
    WHERE post_state.state = 'all'
    )
    OR posts.id IN (
    SELECT posts.id
    FROM user_follows uf
    INNER JOIN user_posts up ON uf.user_following_id = up.user_id
    INNER JOIN posts ON up.post_id = posts.id
    WHERE uf.user_id = $1
    );
    `
    const result = await queryData<UserPostModel>(this.pg, queryText, [userId])
    if (result.length === 0) {
      return []
    }
    return result
  }
  getPostsPublicAll = async (): Promise<UserPostModel[]> => {
    const queryText = `
   SELECT posts.*,ua.*
    FROM posts
    INNER JOIN user_posts up ON up.post_id = posts.id
    INNER JOIN users_account ua ON up.user_id = ua.user_id
    WHERE posts.id IN (
        SELECT post_state.id
        FROM post_state
        WHERE post_state.state = 'all'
    )   
    `
    const result = await queryData<UserPostModel>(this.pg, queryText, [])
    if (result.length === 0) {
      return []
    }
    return result
  }
  getPostUserFollow = async (userId: string, userIdFollow: string): Promise<PostModel[]> => {
    const queryText = `
    select p.*
from user_follows uf
inner join user_posts up on uf.user_following_id=up.user_id
inner join posts p on up.post_id=p.id
inner join post_state ps on p.id=ps.id
where p.id in(
select post_state.id from post_state
where post_state.state = 'follower' or post_state.state='all'
)
and uf.user_id=$1 and uf.user_following_id=$2
    `
    const result = await queryData<PostModel>(this.pg, queryText, [userId, userIdFollow])
    if (result.length === 0) {
      return []
    }
    return result
  }
  getPostPublicAllByUserId = async (userId: string): Promise<PostModel[]> => {
    const queryText = `
    select p.*,ps.state
from users_account ua
inner join user_posts up on ua.user_id=up.user_id
inner join posts p on up.post_id=p.id
inner join post_state ps on p.id=ps.id
where p.id in(
select post_state.id from post_state
where post_state.state='all'
)
and ua.user_id=$1
    `
    const result = await queryData<PostModel>(this.pg, queryText, [userId])
    if (result.length === 0) {
      return []
    }
    return result.map((post) => {
      return {
        id: post.id,
        content: post.content,
        image_url: post.image_url,
        state: post.state
      }
    })
  }
}
export default PostRepository
