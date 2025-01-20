import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api', taskRoutes)

const PORT = process.env.APP_PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})