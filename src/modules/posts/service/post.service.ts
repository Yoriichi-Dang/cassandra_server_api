import PostModel from '../models/post_model'
import UserPostModel from '../models/user_post_model'
import PostRepository from '../repository/post.repository'

class PostService {
  private postRepository: PostRepository
  constructor() {
    this.postRepository = new PostRepository()
  }
  createPost = async (postModel: PostModel): Promise<number> => {
    return await this.postRepository.createPost(postModel)
  }
  getPostById = async (postId: string): Promise<UserPostModel | null> => {
    return await this.postRepository.getPostById(postId)
  }
  getAllPostByUserId = async (userId: string): Promise<UserPostModel[]> => {
    return await this.postRepository.getAllPostByUserId(userId)
  }
  getPostsPublicAll = async (): Promise<UserPostModel[]> => {
    return await this.postRepository.getPostsPublicAll()
  }
  getPostUserFollow = async (userId: string, userIdFollow: string): Promise<PostModel[]> => {
    return await this.postRepository.getPostUserFollow(userId, userIdFollow)
  }
  getPostPublicAllByUserId = async (userId: string): Promise<PostModel[]> => {
    return await this.postRepository.getPostPublicAllByUserId(userId)
  }
}

export default PostService
