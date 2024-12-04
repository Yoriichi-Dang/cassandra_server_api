import bcrypt from 'bcrypt'
import crypto from 'crypto'
const saltRounds = 10
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const match = await bcrypt.compare(password, hashedPassword)
  return match
}
const generateTempPassword = (loginName: string): string => {
  const currentDateTime = new Date().toISOString() // Get the current date-time
  const rawPassword = `${loginName}-${currentDateTime}` // Combine login name and current time
  return crypto.createHash('sha256').update(rawPassword).digest('hex').substring(0, 10) // Hash and shorten
}

export { hashPassword, verifyPassword, generateTempPassword }
