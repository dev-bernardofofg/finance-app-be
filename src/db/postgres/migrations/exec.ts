import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../client.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const execMigrations = async () => {
  const filePath = path.join(__dirname, '01-init.sql')
  const file = fs.readFileSync(filePath, 'utf8')
  const client = await pool.connect()
  try {
    await client.query(file)
    console.log('Migrations executed successfully')
  } finally {
    client.release()
  }
}

execMigrations()
