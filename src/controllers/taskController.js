import supabase from '../lib/db.js'

export const getTasks = async (req, res) => {
    try {
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', req.user.id)

        if(error) {
            return res.status(500).json({ 
                message: 'Hubo un error al obtener las tareas.', 
                error: error
            })
        }
        return res.status(200).json(tasks)
    } catch (error) {
        return res.status(500).json({ 
            message: 'Hubo un error al obtener las tareas.', 
            error: error
        })
    }

}

export const createTasks = async (req, res) => {
    const { title, description } = req.body

    if(!title || !description) return res.status(400).json({ message: 'Por favor complete todos los campos.' })
    if(title.length < 3 && title.length > 120) return res.status(400).json({ message: 'El título debe tener entre 3 y 120 caracteres.' })
    if(description.length < 3 && description.length > 255) return res.status(400).json({ message: 'La descripción debe tener entre 3 y 255 caracteres.' })

    try {
        const { data: task, error } = await supabase
            .from('tasks')
            .insert({ 
                title, 
                description,
                user_id: req.user.id,
                status: true
            })
            .select('*')
            .single()

        if(error) {
            return res.status(500).json({ 
                message: 'Hubo un error al crear la tarea.', 
                error: error
            })
        }
        return res.status(201).json({
            message: 'Tarea creada con éxito.',
            task: task
        })

    } catch (error) {
        return res.status(500).json({ 
            message: 'Hubo un error al crear la tarea.', 
            error: error
        })
    }
}
