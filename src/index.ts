import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './modules/auth/routes/auth_route'
dotenv.config()
const app = express()

app.use(express.json())
app.use('/', authRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
