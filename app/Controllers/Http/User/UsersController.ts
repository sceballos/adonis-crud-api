import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserManager from 'App/Managers/User/UserManager'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async login({ response }: HttpContextContract) {
    response.notImplemented()
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

  public async delete({ response }: HttpContextContract) {
    response.notImplemented()
  }
}
