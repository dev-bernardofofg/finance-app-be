import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../client.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const execMigrations = async () => {
  const client = await pool.connect()
  try {
    // Lê todos os arquivos .sql e ordena por nome
    const files = fs
      .readdirSync(__dirname)
      .filter((file) => file.endsWith('.sql'))
      .sort()

    console.log(`Found ${files.length} migration file(s)`)

    for (const file of files) {
      const filePath = path.join(__dirname, file)
      const sql = fs.readFileSync(filePath, 'utf8')
      console.log(`Executing migration: ${file}`)
      await client.query(sql)
      console.log(`✓ ${file} executed successfully`)
    }

    console.log('\nAll migrations executed successfully')
  } catch (err) {
    console.error('Migration error:', err)
    throw err
  } finally {
    client.release()
  }
}

execMigrations()
