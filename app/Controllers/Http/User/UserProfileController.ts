import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async getUser({ response }: HttpContextContract) {
    response.notImplemented()
  }

  public async updateName({ response }: HttpContextContract) {
    response.notImplemented()
  }

  public async updateEmail({ response }: HttpContextContract) {
    response.notImplemented()
  }

  public async updatePassword({ response }: HttpContextContract) {
    response.notImplemented()
  }
}
