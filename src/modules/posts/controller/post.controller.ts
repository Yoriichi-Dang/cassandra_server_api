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
      userIdPost: id
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
  getListPost = async (req: TokenDecodeRequest, res: Response): Promise<void> => {
    const isLogin = req.user ? true : false
  }
  getAllPostsAuth = async (req: TokenDecodeRequest, res: Response): Promise<void> => {
    const isLogin = req.user ? true : false
    if (isLogin && req.user) {
      console.log(req.user)
      const posts = await this.postService.getAllPostByUserId(req.user.id)
      res.status(200).send(posts)
    } else {
      res.status(200).send([])
    }
  }

  updatePost = async (req: Request, res: Response): Promise<void> => {}
  deletePost = async (req: Request, res: Response): Promise<void> => {}
}
export default PostController
