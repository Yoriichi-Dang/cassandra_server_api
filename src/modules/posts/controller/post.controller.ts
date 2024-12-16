import { TokenDecodeRequest } from '@/types/type'
import { Response, Request } from 'express'
import PostService from '../service/post.service'
import PostDto from '../dtos/post_dto'
import PostModel from '../models/post_model'
import { JwtPayload } from 'jsonwebtoken'
import { verifyToken } from '@/utils/jwt'

class PostController {
  private postService: PostService
  constructor() {
    this.postService = new PostService()
  }
  createPost = async (req: TokenDecodeRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(400).send({ message: 'Invalid token' })
      return
    }
    const postDto: PostDto = req.body
    const { id } = req.user
    const postModel: PostModel = {
      ...postDto,
      user_id_post: id
    }
    const result = await this.postService.createPost(postModel)
    if (result == -1) {
      res.status(500).send({ message: 'Internal server error' })
    } else {
      res.status(201).send({ post: result })
    }
  }
  getPostDetail = async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params
    const result = await this.postService.getPostById(postId)
    if (!result) {
      res.status(404).send({ message: 'Post not found' })
    } else {
      res.status(200).send(result)
    }
  }
  getPostsPublicAll = async (req: Request, res: Response): Promise<void> => {
    const result = await this.postService.getPostsPublicAll()
    res.status(200).send(result)
  }
  getAllPostsAuth = async (req: TokenDecodeRequest, res: Response): Promise<void> => {
    const isLogin = req.user ? true : false
    if (isLogin && req.user) {
      const posts = await this.postService.getAllPostByUserId(req.user.id)
      res.status(200).send(posts)
    } else {
      res.status(200).send([])
    }
  }
  getPostUserFollow = async (req: TokenDecodeRequest, res: Response): Promise<void> => {
    const userId = req.query.userId as string
    const { id } = req.user as JwtPayload
    const posts = await this.postService.getPostUserFollow(id, userId)
    res.status(200).send(posts)
  }
  getPostPublicAllByUserId = async (req: Request, res: Response): Promise<void> => {
    const userIdParam = req.query.userId as string
    const posts = await this.postService.getPostPublicAllByUserId(userIdParam)
    res.status(200).send(posts)
  }
  updatePost = async (req: Request, res: Response): Promise<void> => {}
  deletePost = async (req: Request, res: Response): Promise<void> => {}
}
export default PostController
