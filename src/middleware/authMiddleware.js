import jwt from 'jsonwebtoken'

const protect = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if(!token) {
        return res.status(401).json({ message: 'No se ha proporcionado un token válido.' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN)
        req.user = { id: decoded.userId }
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token no válido.' })
    }
}

export default protect