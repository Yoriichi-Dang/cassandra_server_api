import { hashPassword } from '@/utils/password'
import { AuthRegisterDto } from '../dtos/auth_dto'
import AuthService from '../service/auth.service'
import { Request, Response, NextFunction } from 'express'
import UserLoginData from '../models/user_login_data_model'

class AuthController {
  private authService: AuthService
  constructor() {
    this.authService = new AuthService()
  }
  registerAccout = async (req: Request<object, object, AuthRegisterDto>, res: Response): Promise<void> => {
    const { email, password, username }: AuthRegisterDto = req.body
    const hashedPassword = await hashPassword(password)
    const userLoginData: UserLoginData = {
      email,
      passwordHash: hashedPassword,
      username
    }

    res.send(userLoginData)
  }
  login = async (req: Request, res: Response) => {
    res.send('Login')
  }
}

export default AuthController
