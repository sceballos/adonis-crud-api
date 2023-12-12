import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'

export default class AuthManager {
  /**----------------------------------------------------------------------------------------
   * public static async GenerateToken
   * @param payload: any
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
   * @param payload: any
   * @returns string | null
   *----------------------------------------------------------------------------------------*/
  public static VerifyToken(token: string): any | null {
    try {
      const payload = jwt.verify(token, Env.get('APP_KEY'))
      return payload
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
