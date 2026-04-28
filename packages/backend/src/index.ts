import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import helloRouter from './routes/hello.js'
import { dbConfig } from './config/database.js'

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

app.use('/api', helloRouter)

app.get('/', (_req, res) => {
  res.json({ message: 'AI Chat Backend' })
})

app.get('/api/db-test', async (_req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig)
    const [rows] = await connection.execute('SELECT 1 as result')
    await connection.end()
    res.json({ success: true, data: rows })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
