import { Request } from 'express'
interface TokenDecodeRequest extends Request {
  user?: JwtPayload
}
