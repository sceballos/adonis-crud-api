import CryptoManager from 'App/Managers/Auth/CryptoManager'
import { AuthenticatedRequest } from 'App/Managers/Auth/Types'
import UserManager from 'App/Managers/User/UserManager'
import UpdateUserPasswordValidator from 'App/Validators/UserProfile/UpdateUserPasswordValidator'

export default class UserSettingsController {
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
