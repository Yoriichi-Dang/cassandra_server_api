type AuthLoginDto = {
  email: string
  password: string
}
type AuthRegisterDto = AuthLoginDto & {
  username: string
}

export { AuthLoginDto, AuthRegisterDto }
