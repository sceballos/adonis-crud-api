import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export interface AuthenticatedRequest extends HttpContextContract {
  userId: number
}

export interface JWTPayload {
  id: number
  iat: number
}
