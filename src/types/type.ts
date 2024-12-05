import { JwtPayload } from '@/utils/jwt'
import { Request } from 'express'
interface TokenDecodeRequest extends Request {
  user?: JwtPayload
}
export { TokenDecodeRequest }
