import express from 'express'
import { PostgresHelper } from './db/postgres/helper.js'

const app = express()
app.use(express.json())

app.get('/', async (req, res) => {
  try {
    const results = await PostgresHelper.query('SELECT * FROM users')
    res.json(results)
  } catch (err) {
    console.error('Database error:', err)
    const error = err as Error
    res.status(500).json({
      error: 'Database connection failed',
      message: error.message,
    })
  }
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
