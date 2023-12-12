import { AuthenticatedRequest } from 'App/Managers/Auth/Types'
import UserManager from 'App/Managers/User/UserManager'
import UpdateUserEmailValidator from 'App/Validators/UserProfile/UpdateUserEmailValidator'
import UpdateUserNameValidator from 'App/Validators/UserProfile/UpdateUserNameValidator'

export default class UsersController {
  public async getUser({ response }: AuthenticatedRequest) {
    response.notImplemented()
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
