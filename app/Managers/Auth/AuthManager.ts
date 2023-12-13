import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import { JWTPayload } from './Types'

export default class AuthManager {
  /**----------------------------------------------------------------------------------------
   * public static async GenerateToken
   * @param payload: any
   * @description Generates and returns a JWT token string using payload provided.
   * @returns string
   *----------------------------------------------------------------------------------------*/
  public static GenerateToken(payloadID: number): string {
    const token = jwt.sign(
      {
        id: payloadID,
      },
      Env.get('APP_KEY')
    )
    return token
  }

  /**----------------------------------------------------------------------------------------
   * public static async VerifyToken
   * @param token: string
   * @description Verifies a JWT token string. Returns null if verification fails.
   * @returns JWTPayload | null
   *----------------------------------------------------------------------------------------*/
  public static VerifyToken(token: string): JWTPayload | null {
    try {
      const payload = jwt.verify(token, Env.get('APP_KEY'))
      return payload as JWTPayload
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
