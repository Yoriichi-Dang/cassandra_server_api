type PostModel = {
  id?: string
  content: string
  image_url: string
  caption?: string
  user_id_post?: string
  state?: string
  countLove?: number
  created_at?: Date
  updated_at?: Date
}
export default PostModel
