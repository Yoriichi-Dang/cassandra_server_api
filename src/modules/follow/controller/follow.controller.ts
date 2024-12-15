import FollowService from '../service/follow.service'
import { TokenDecodeRequest } from '@/types/type'
import { Response } from 'express'
class FollowController {
  private followService: FollowService
  constructor() {
    this.followService = new FollowService()
  }
  checkFollow = async (req: TokenDecodeRequest, res: Response) => {
    if (!req.user) {
      res.status(400).send({ message: 'Invalid token' })
      return
    }
    const followerId = req.user.id
    const followingId = req.body.followingId
    if (!followingId) {
      res.status(400).send({ message: 'Following id is required' })
      return
    }
    const checkFollow = await this.followService.checkFollow(followerId, followingId)
    res.status(200).send({ checkFollow })
  }
  followUser = async (req: TokenDecodeRequest, res: Response) => {
    if (!req.user) {
      res.status(400).send({ message: 'Invalid token' })
      return
    }
    const followerId = req.user.id
    const followingId = req.body.followingId
    if (followerId == followingId) {
      res.status(400).send({ message: 'You can not follow yourself' })
      return
    }
    if (!followingId) {
      res.status(400).send({ message: 'Following id is required' })
      return
    }
    const follow = await this.followService.followUser(followerId, followingId)
    if (follow == -1) {
      res.status(400).send({ message: 'You already follow this user' })
      return
    }
    res.status(201).send({ follow })
  }
  unFollowUser = async (req: TokenDecodeRequest, res: Response) => {
    if (!req.user) {
      res.status(400).send({ message: 'Invalid token' })
      return
    }
    const followerId = req.user.id
    const followingId = req.body.followingId
    if (!followingId) {
      res.status(400).send({ message: 'Following id is required' })
      return
    }
    if (followerId == followingId) {
      res.status(400).send({ message: 'You can not unfollow yourself' })
      return
    }
    const follow = await this.followService.unFollowUser(followerId, followingId)
    if (follow == -1) {
      res.status(400).send({ message: 'You do not follow this user' })
      return
    }
    res.status(200).send({ follow })
  }
}
export default FollowController
