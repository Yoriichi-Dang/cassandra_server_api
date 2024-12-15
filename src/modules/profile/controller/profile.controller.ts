import ProfileService from '../service/profile.service'
import { Response, Request } from 'express'
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
  getUserPosts = async (req: TokenDecodeRequest, res: Response) => {
    if (!req.user) {
      res.status(400).send({ message: 'Invalid token' })
      return
    }
    const { id } = req.user
    const posts = await this.profileService.getUserPosts(id)
    if (!posts) {
      res.status(200).send([])
      return
    }
    res.status(200).send(posts)
  }
  updateUsername = async (req: TokenDecodeRequest, res: Response) => {
    if (!req.user) {
      res.status(400).send({ message: 'Invalid token' })
      return
    }
    const { id } = req.user
    const { username } = req.body
    const profile: UserModel | null = await this.profileService.updateUsername(id, username)
    if (!profile) {
      res.status(400).send({ message: 'Username already exist' })
    } else {
      res.status(200).send(profile)
    }
  }
  updatePhoneEmail = async (req: TokenDecodeRequest, res: Response) => {
    if (!req.user) {
      res.status(400).send({ message: 'Invalid token' })
      return
    }
    const { id } = req.user
    const userDto: UserDto = req.body
    const profile: UserModel | null = await this.profileService.updatePhoneEmail(id, userDto)
    if (!profile) {
      res.status(400).send({ message: 'Phone or email already exist' })
    } else {
      res.status(200).send(profile)
    }
  }
  findUsersByUsername = async (req: Request, res: Response) => {
    const { username } = req.params
    const users: UserModel[] | null = await this.profileService.findUserByUsername(username as string)
    if (!users) {
      res.status(404).send({ message: 'User not found' })
      return
    }
    res.status(200).send(users)
  }
  // getUserProfileById = async (req: Request, res: Response) => {
  //   const { id } = req.params
  //   const userDto: UserDto | null = await this.profileService.getProfile(id)
  //   if (!userDto) {
  //     res.status(404).send({ message: 'User not found' })
  //     return
  //   }
  //   res.status(200).send(userDto)
  // }
}
export default ProfileController
