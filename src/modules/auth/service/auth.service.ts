import { UserLoginDataDto } from '../dtos/user_dto'
import UserLoginData from '../models/user_login_data_model'
import AuthRepository from '../repository/auth.repository'

class AuthService {
  private authRepository: AuthRepository
  constructor() {
    this.authRepository = new AuthRepository()
  }
  registerAccount = async (userLoginData: UserLoginDataDto): Promise<number> => {
    return await this.authRepository.createAccount(userLoginData)
  }
  findUserByEmail = async (email: string): Promise<UserLoginData | null> => {
    return await this.authRepository.findUserByEmail(email)
  }
}
export default AuthService
