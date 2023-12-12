import AuthManager from 'App/Managers/Auth/AuthManager'
import { AuthenticatedRequest } from 'App/Managers/Auth/Types'

export default class JwtAuth {
  public async handle(requestContext: AuthenticatedRequest, next: () => Promise<void>) {
    const { request, response } = requestContext

    const authHeader = request.headers().authorization

    if (!authHeader) {
      return response.unauthorized({ error: 'Authorization token not provided' })
    }

    const tokenVerification = await AuthManager.VerifyToken(authHeader.replace('Bearer ', ''))

    if (!tokenVerification) {
      return response.unauthorized({ error: 'Invalid authorization token provided' })
    }

    requestContext.userId = tokenVerification.id

    await next()
  }
}
