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
}

export default PostService
