import FollowRepository from '../repository/follow.repository'

class FollowService {
  private followRepository: FollowRepository
  constructor() {
    this.followRepository = new FollowRepository()
  }
  followUser = async (followerId: string, followingId: string): Promise<number> => {
    return await this.followRepository.followUser(followerId, followingId)
  }
  unFollowUser = async (followerId: string, followingId: string): Promise<number> => {
    return await this.followRepository.unFollowUser(followerId, followingId)
  }
  checkFollow = async (followerId: string, followingId: string): Promise<boolean> => {
    return await this.followRepository.checkFollow(followerId, followingId)
  }
}
export default FollowService
