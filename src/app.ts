import express from 'express'
import morgan from 'morgan'
import { routes } from './routes'

export const app = express()
app.use(express.json())
app.use(morgan('dev'))

app.use(routes)
