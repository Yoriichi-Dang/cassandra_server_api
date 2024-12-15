type PostModel = {
  id?: string
  content: string
  imageUrl: string
  caption?: string
  userIdPost?: string
  state?: string
  countLove?: number
  created_at?: Date
  updated_at?: Date
}
export default PostModel
