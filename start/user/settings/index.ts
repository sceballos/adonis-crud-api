import Route from '@ioc:Adonis/Core/Route'
import { USER_API_PATH, UserSubRoutes } from '..'

export const USER_SETTINGS_API_PATH = `${USER_API_PATH}/${UserSubRoutes.Settings}`

export enum UserSettings {
  Password = 'password',
}

Route.group(() => {
  /**----------------------------------------------------------------------------------------
   * @api {patch} /user/settings/password Update user password
   * @apiUse JWTAuthorization
   * @apiName user-update-password
   * @apiGroup User
   * @apiDescription Updates an existing user name
   * @apiBody {string} current_password Current user's password
   * @apiBody {string} new_password New user's password
   * @apiBody {string} new_password_repeat Repetition of new user's password for confirmation purposes
   * @apiParamExample {json} Request-Example:
   * {
   *   current_password: string,
   *   new_password: string,
   *   new_password_repeat: string
   * }
   * @apiSuccess {Json} Returns 200 OK
   * @apiSuccessExample
   * HTTP/1.1 200 OK
   * {
   * }
   *
   */
  Route.patch(UserSettings.Password, 'User/UserSettingsController.updatePassword')
})
  .prefix(USER_SETTINGS_API_PATH)
  .middleware('JwtAuth')
