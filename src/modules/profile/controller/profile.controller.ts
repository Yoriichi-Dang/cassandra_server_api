import ProfileService from '../service/profile.service'
import { Request, Response } from 'express'
import { TokenDecodeRequest } from '@/types/type'
import UserDto from '../dtos/user_dto'
import UserModel from '@/modules/auth/models/user_model'
class ProfileController {
  private profileService: ProfileService
  constructor() {
    this.profileService = new ProfileService()
  }
  getProfile = async (req: TokenDecodeRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'Invalid token' })
      return
    }
    const userDto: UserDto | null = await this.profileService.getProfile(req.user.id)
    res.status(200).send(userDto)
  }
  updateProfile = async (req: TokenDecodeRequest, res: Response) => {
    if (!req.user) {
      res.status(400).send({ message: 'Invalid token' })
      return
    }
    const { id } = req.user
    const userDto: Partial<UserDto> = req.body
    const profile: UserModel | null = await this.profileService.updateProfile(id, userDto)
    res.status(200).send(profile)
  }
  updateProfileImage = async (req: TokenDecodeRequest, res: Response) => {
    if (!req.user) {
      res.status(400).send({ message: 'Invalid token' })
      return
    }
    const { id } = req.user
    const { avatar_url } = req.body
    const profile: UserModel | null = await this.profileService.updateProfileImage(id, avatar_url)
    res.status(200).send(profile)
  }
}
export default ProfileController