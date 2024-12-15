import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './modules/auth/routes/auth_route'
import postRoutes from './modules/posts/routes/post_route'
import profileRoutes from './modules/profile/routes/profile_route'
dotenv.config()
const app = express()

app.use(express.json())
app.use('/', authRoutes)
app.use('/profile', profileRoutes)
app.use('/posts', postRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
