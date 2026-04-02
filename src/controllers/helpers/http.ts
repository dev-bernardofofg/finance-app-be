import { Response } from 'express'

type JsonSerializable = string | number | boolean | null | object | unknown[]
export type HttpResponse = Pick<Response, 'status' | 'json'>

export const responseHelper = {
  badRequest: (res: HttpResponse, message: string) =>
    res.status(400).json({ message }),
  internalServerError: (res: HttpResponse, message: string) =>
    res.status(500).json({ message }),
  created: <T extends JsonSerializable>(res: HttpResponse, data: T) =>
    res.status(201).json(data),
  ok: <T extends JsonSerializable>(res: HttpResponse, data: T) =>
    res.status(200).json(data),
  notFound: (res: HttpResponse, message: string) =>
    res.status(404).json({ message }),
  unauthorized: (res: HttpResponse, message: string) =>
    res.status(401).json({ message }),
  forbidden: (res: HttpResponse, message: string) =>
    res.status(403).json({ message }),
  conflict: (res: HttpResponse, message: string) =>
    res.status(409).json({ message }),
}
