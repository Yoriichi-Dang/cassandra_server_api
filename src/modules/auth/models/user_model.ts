type UserModel = {
  id?: string
  username: string
  email: string
  phone: string
  full_name: string
  avatar_url: string
  district: string
  province: string
  address: string
  day_of_birth: Date
  gender: string
  description: string
  password_hash?: string
  following?: number | 0
  follower?: number | 0
  created_at?: Date
  updated_at?: Date
}
export default UserModel
