import UserModel from '@/modules/auth/models/user_model'
import ProfileRepository from '../repository/profile.repository'
import UserDto from '../dtos/user_dto'
import PostModel from '@/modules/posts/models/post_model'

class ProfileService {
  private profileRepository: ProfileRepository
  constructor() {
    this.profileRepository = new ProfileRepository()
  }
  getProfile = async (id: string): Promise<UserDto | null> => {
    const userModel: UserModel | null = await this.profileRepository.findProfile(id)
    if (!userModel) {
      return null
    }
    const userDto: UserDto = {
      email: userModel.email,
      username: userModel.username,
      phone: userModel.phone,
      avatar_url: userModel.avatar_url,
      full_name: userModel.full_name,
      district: userModel.district,
      province: userModel.province,
      address: userModel.address,
      day_of_birth: userModel.day_of_birth,
      gender: userModel.gender,
      description: userModel.description
    }
    return userDto
  }
  updateProfile = async (id: string, profile: Partial<UserDto>): Promise<UserModel | null> => {
    const result: number = await this.profileRepository.updateProfile(id, profile)
    if (result === -1) {
      return null
    }
    const userModel: UserModel | null = await this.profileRepository.findProfile(id)
    return userModel
  }
  updateProfileImage = async (id: string, avatarUrl: string): Promise<UserModel | null> => {
    const result: number = await this.profileRepository.updateProfileImage(id, avatarUrl)
    if (result === -1) {
      return null
    }
    const userModel: UserModel | null = await this.profileRepository.findProfile(id)
    return userModel
  }
  getUserPosts = async (id: string): Promise<PostModel[] | null> => {
    return await this.profileRepository.getUserPosts(id)
  }
  updateUsername = async (id: string, username: string): Promise<UserModel | null> => {
    const result: number = await this.profileRepository.updateUsername(id, username)
    if (result === -1) {
      return null
    }
    const userModel: UserModel | null = await this.profileRepository.findProfile(id)
    return userModel
  }
  updatePhoneEmail = async (id: string, profile: UserDto): Promise<UserModel | null> => {
    const result: number = await this.profileRepository.updatePhoneEmail(id, profile)
    if (result === -1) {
      return null
    }
    const userModel: UserModel | null = await this.profileRepository.findProfile(id)
    return userModel
  }
}
export default ProfileService
