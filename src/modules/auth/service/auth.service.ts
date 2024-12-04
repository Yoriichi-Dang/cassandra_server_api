import UserLoginData from '../models/user_login_data_model'
import AuthRepository from '../repository/auth.repository'

class AuthService {
  private authRepository: AuthRepository
  constructor() {
    this.authRepository = new AuthRepository()
  }
  registerAccount = async (userLoginData: UserLoginData) => {
    return this.authRepository.createAccount(userLoginData)
  }
}
export default AuthService
