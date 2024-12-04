import UserLoginData from '../models/user_login_data_model'

type UserLoginDataDto = Omit<UserLoginData, 'id'>
export { UserLoginDataDto }
