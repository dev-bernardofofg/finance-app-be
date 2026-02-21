import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import { routes } from './routes'

const app = express()
app.use(express.json())
app.use(morgan('dev'))

app.use(routes)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
