import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { getTasks, createTasks } from '../controllers/taskController.js'

const router = express.Router()

router.get('/tasks', protect, getTasks)
router.post('/tasks', protect, createTasks)

export default router