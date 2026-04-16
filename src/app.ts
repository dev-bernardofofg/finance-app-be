import express from 'express'
import fs from 'fs'
import morgan from 'morgan'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import { routes } from './routes'

export const app = express()

app.use(express.json())
app.use(morgan('dev'))

const swaggerDocument = JSON.parse(
  fs.readFileSync(
    path.join(import.meta.dirname, '..', 'docs', 'swagger.json'),
    'utf8',
  ),
)

app.use(routes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
