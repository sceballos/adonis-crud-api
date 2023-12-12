import CryptoManager from 'App/Managers/Auth/CryptoManager'
import { AuthenticatedRequest } from 'App/Managers/Auth/Types'
import UserManager from 'App/Managers/User/UserManager'
import UpdateUserEmailValidator from 'App/Validators/UserProfile/UpdateUserEmailValidator'
import UpdateUserNameValidator from 'App/Validators/UserProfile/UpdateUserNameValidator'
import UpdateUserPasswordValidator from 'App/Validators/UserProfile/UpdateUserPasswordValidator'

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

  public async updatePassword({ request, response, userId }: AuthenticatedRequest) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { current_password, new_password, new_password_repeat } = await request.validate(
      UpdateUserPasswordValidator
    )

    const user = await UserManager.GetByID(userId)

    if (!user) {
      return response.badRequest({
        error: 'User not found.',
      })
    }

    const currentPasswordHash = CryptoManager.GenerateHash(current_password)

    if (user.password !== currentPasswordHash) {
      return response.badRequest({
        error: 'Current password is incorrect.',
      })
    }

    if (new_password !== new_password_repeat) {
      return response.badRequest({
        error: 'New password does not match.',
      })
    }

    const updatedUser = await UserManager.UpdateUserPassword(userId, new_password)

    if (!updatedUser) {
      return response.internalServerError()
    }

    response.send({})
  }
}
