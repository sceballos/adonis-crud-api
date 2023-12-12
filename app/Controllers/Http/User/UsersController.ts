import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthManager from 'App/Managers/Auth/AuthManager'
import { AuthenticatedRequest } from 'App/Managers/Auth/Types'
import UserManager from 'App/Managers/User/UserManager'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import LoginUserValidator from 'App/Validators/LoginUserValidator'

export default class UsersController {
  public async login({ request, response }: HttpContextContract) {
    const { email, password } = await request.validate(LoginUserValidator)

    const user = await UserManager.Authenticate(email, password)

    if (!user) {
      return response.badRequest({ error: 'Invalid email or password ' })
    }

    const authToken = AuthManager.GenerateToken(user.id)
    response.send({ token: authToken, username: user.name })
  }

  public async create({ request, response }: HttpContextContract) {
    const { username, password, email } = await request.validate(CreateUserValidator)

    const existingUser = await UserManager.GetByEmail(email)

    if (existingUser) {
      return response.badRequest({ error: 'User already registered with this email.' })
    }
    const createResult = await UserManager.Create(username, email, password)

    if (!createResult) {
      return response.internalServerError()
    }

    response.send(createResult)
  }

  public async delete({ userId, response }: AuthenticatedRequest) {
    const userDeletion = await UserManager.Delete(userId)

    if (!userDeletion) {
      return response.internalServerError()
    }

    response.send({})
  }
}
