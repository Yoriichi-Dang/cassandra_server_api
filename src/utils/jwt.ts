import jwt, { TokenExpiredError } from 'jsonwebtoken'

type JwtPayload = { id: string; email: string }

const createToken = ({ id, email }: JwtPayload, expiresIn: string): string => {
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
    expiresIn
  })
  return token
}

const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { exp: number }
    return decoded
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      console.log(`Token has expired: ${error.message}`)
      return null
    } else if (error instanceof Error) {
      // For other errors that are instances of Error
      console.log(`Invalid token: ${error.message}`)
      return null
    } else {
      // If the error is of an unknown type
      console.log(`An unknown error occurred during token verification.`)
      return null
    }
  }
}
export { verifyToken, createToken, JwtPayload }
