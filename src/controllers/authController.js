import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import supabase from '../lib/db.js'
import { validateEmail } from '../utils/tools.js'

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body

    if(!username || !email || !password) {
        return res.status(400).json({ message: 'Por favor rellene todos los campos.' })
    }

    if(!validateEmail(email) && email.length > 8) {
        return res.status(400).json({ message: 'Por favor ingrese un correo electrónico válido.' })
    }

    if(!password || password.length < 8) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' })
    }

    if(!isNaN(username) && !username.length < 3) {
        return res.status(400).json({ message: 'El nombre de usuario debe tener al menos 3 caracteres.' })
    }

    try {
        const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single()

        if(existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe en los registros.' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const { data, error } = await supabase
            .from('users')
            .insert([{ email, password: hashedPassword, username }])
            .select('id')
            .single()

        if(error) {
            return res.status(500).json({ 
                message: 'Hubo un error al registrar el usuario.', 
                error: error
            })
        }

        const token = jwt.sign({
            userId: data.id,
            email: email
        }, 
            process.env.JWT_SECRET_TOKEN, 
            { 
                expiresIn: '12h'
            }
        )

        return res.status(201).json({
            message: 'Usuario registrado exitosamente.',
            token: token
        })
    } catch (error) {
        return res.status(500).json({ 
            message: 'Ha ocurrido un error inesperado, por favor intente nuevamente más tarde.', 
            error: error
        })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    if(!email || !password) {
        return res.status(400).json({ message: 'Por favor rellene todos los campos.' })
    }

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, password')
            .eq('email', email)
            .single()

        if(error || !user) {
            return res.status(404).json({ message: 'El usuario no existe en los registros.' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(400).json({ message: 'El correo o contraseña son incorrectos. Por favor intente nuevamente.' })
        }

        const token = jwt.sign({
            userId: user.id,
            email: email,
            },
            process.env.JWT_SECRET_TOKEN,
            {
                expiresIn: '12h'
            }
        )

        return res.status(200).json({
            message: 'Usuario autenticado exitosamente.',
            token: token
        })

    } catch (error) {
        return res.status(500).json({ 
            message: 'Ha ocurrido un error inesperado, por favor intente nuevamente más tarde.', 
            error: error
        })
    }
}