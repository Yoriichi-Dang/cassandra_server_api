import { TokenDecodeRequest } from '@/types/type'
import { JwtPayload, verifyToken } from '@/utils/jwt'
import { NextFunction, Response } from 'express'
import { TokenExpiredError } from 'jsonwebtoken'

const authMiddleware = async (req: TokenDecodeRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'] as string | undefined
  const token = authHeader ? authHeader.split(' ')[1] : null
  if (!token || token === 'undefined') {
    res.status(401).json({ message: 'No token provided' })
    return
  }
  try {
    const decoded: JwtPayload | null = verifyToken(token as string)
    if (!decoded) {
      res.status(401).json({ message: 'Invalid token' })
      return
    }
    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ message: 'Token has expired' })
    } else if (error instanceof Error && error.message === 'INVALID_TOKEN') {
      res.status(403).json({ message: 'Invalid token' })
    } else if (error instanceof Error && error.message === 'TOKEN_EXPIRED') {
      res.status(401).json({ message: 'Token has expired' })
    } else {
      res.status(500).json({ message: 'Internal server error' }) // Handle other errors
    }
  }
}
export default authMiddleware
