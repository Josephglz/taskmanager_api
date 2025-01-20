const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

//routes

const PORT = process.env.APP_PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})