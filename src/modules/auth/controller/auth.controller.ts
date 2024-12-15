import { hashPassword, verifyPassword } from '@/utils/password'
import { AuthLoginDto, AuthRegisterDto } from '../dtos/auth_dto'
import AuthService from '../service/auth.service'
import { Request, Response, NextFunction } from 'express'
import UserLoginData from '../models/user_login_data_model'
import { createToken } from '@/utils/jwt'

class AuthController {
  private authService: AuthService
  constructor() {
    this.authService = new AuthService()
  }
  registerAccout = async (req: Request<object, object, AuthRegisterDto>, res: Response): Promise<void> => {
    const { email, password, username }: AuthRegisterDto = req.body
    const hashedPassword = await hashPassword(password)
    const userLoginData: Omit<UserLoginData, 'id'> = {
      email,
      passwordHash: hashedPassword,
      username
    }
    const userId = await this.authService.registerAccount(userLoginData)
    if (userId == 0) {
      res.status(400).send({ message: 'Email already exist' })
    } else if (userId == -1) {
      res.status(400).send({ message: 'Username already exist' })
    } else {
      res.status(201).send({ userId })
    }
  }
  login = async (req: Request, res: Response) => {
    const { email, password }: AuthLoginDto = req.body
    const userLoginData: UserLoginData | null = await this.authService.findUserByEmail(email)
    if (!userLoginData) {
      res.status(404).send({ message: 'Email not found' })
      return
    }
    const match = await verifyPassword(password, userLoginData.passwordHash)
    if (!match) {
      res.status(400).send({ message: 'Password incorrect' })
      return
    }
    const accessToken = createToken({ id: userLoginData.id, email: userLoginData.email }, '5m')
    const refreshToken = createToken({ id: userLoginData.id, email: userLoginData.email }, '30d')
    res.status(200).send({ accessToken, refreshToken })
  }
  refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body
  }
  logout = async (req: Request, res: Response) => {}
}

export default AuthController
