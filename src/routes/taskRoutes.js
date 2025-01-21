import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { getTask, createTask, deleteTask } from '../controllers/taskController.js'

const router = express.Router()

router.get('/tasks', protect, getTask)
router.post('/tasks', protect, createTask)
router.delete('/tasks/:id', protect, deleteTask)

export default router