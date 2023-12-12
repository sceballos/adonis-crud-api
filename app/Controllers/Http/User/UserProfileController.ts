import { AuthenticatedRequest } from 'App/Managers/Auth/Types'
import UserManager from 'App/Managers/User/UserManager'
import UpdateUserEmailValidator from 'App/Validators/UserProfile/UpdateUserEmailValidator'
import UpdateUserNameValidator from 'App/Validators/UserProfile/UpdateUserNameValidator'

export default class UsersController {
  public async getUser({ params, response }: AuthenticatedRequest) {
    if (!params.id) {
      return response.badRequest({ error: 'User id not provided.' })
    }

    if (isNaN(Number(params.id))) {
      return response.badRequest({ error: 'Invalid user id provided.' })
    }
    const user = await UserManager.GetByID(params.id)

    if (!user) {
      return response.badRequest({ error: 'User not found.' })
    }

    response.send({
      username: user.name,
      email: user.email,
    })
  }

  public async updateName({ request, response, userId }: AuthenticatedRequest) {
    const { name } = await request.validate(UpdateUserNameValidator)

    const updatedUser = await UserManager.UpdateUser(userId, { name: name })

    if (!updatedUser) {
      return response.internalServerError()
    }

    response.send({})
  }

  public async updateEmail({ request, response, userId }: AuthenticatedRequest) {
    const { email } = await request.validate(UpdateUserEmailValidator)

    const updatedUser = await UserManager.UpdateUser(userId, { email: email })

    if (!updatedUser) {
      return response.internalServerError()
    }

    response.send({})
  }

  public async updatePassword({ response }: AuthenticatedRequest) {
    response.notImplemented()
  }
}
