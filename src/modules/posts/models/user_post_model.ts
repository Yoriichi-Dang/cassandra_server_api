import UserDto from '@/modules/profile/dtos/user_dto'
import PostModel from './post_model'
import UserModel from '@/modules/auth/models/user_model'

type UserPostModel = {
  post: PostModel
  userPost: UserModel
}

export default UserPostModel
