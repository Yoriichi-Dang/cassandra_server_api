import UserModel from '@/modules/auth/models/user_model'
import ProfileRepository from '../repository/profile.repository'
import UserDto from '../dtos/user_dto'

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
    const isSuccess: boolean = await this.profileRepository.updateProfile(id, profile)
    if (!isSuccess) {
      return null
    }
    const userModel: UserModel | null = await this.profileRepository.findProfile(id)
    return userModel
  }
  updateProfileImage = async (id: string, avatarUrl: string): Promise<UserModel | null> => {
    const isSuccess: boolean = await this.profileRepository.updateProfileImage(id, avatarUrl)
    if (!isSuccess) {
      return null
    }
    const userModel: UserModel | null = await this.profileRepository.findProfile(id)
    return userModel
  }
}
export default ProfileService
