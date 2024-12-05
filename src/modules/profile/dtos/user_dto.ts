import UserModel from '@/modules/auth/models/user_model'

type UserDto = Omit<UserModel, 'password_hash' | 'created_at' | 'updated_at' | 'id'>
export default UserDto
