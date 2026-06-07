import { Request } from 'express'

export type AuthenticatedRequest = Request & { user_id: string }
