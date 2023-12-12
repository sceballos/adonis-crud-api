import Route from '@ioc:Adonis/Core/Route'
import { USER_API_PATH, UserSubRoutes } from '..'

export const USER_PROFILE_API_PATH = `${USER_API_PATH}/${UserSubRoutes.Profile}`

export enum UserInfo {
  Name = 'name',
  Email = 'email',
  Password = 'password',
}

export enum UserParams {
  UserID = ':id',
}

Route.group(() => {
  /**----------------------------------------------------------------------------------------
   * @api {patch} /user/profile/:id Get user profile
   * @apiUse JWTAuthorization
   * @apiName user-get-profile
   * @apiGroup User
   * @apiDescription Returns user profile by ID
   * @apiParam {number} id User ID
   * @apiSuccess {Json} Returns Object containing user information
   * @apiSuccessExample
   * HTTP/1.1 200 OK
   * {
   *    name: string,
   *    email: string,
   * }
   *
   */
  Route.get(UserParams.UserID, 'User/UserProfileController.getUser')

  /**----------------------------------------------------------------------------------------
   * @api {patch} /user/profile/name Update user name
   * @apiUse JWTAuthorization
   * @apiName user-update-name
   * @apiGroup User
   * @apiDescription Updates an existing user name
   * @apiBody {string} name New user's name
   * @apiParamExample {json} Request-Example:
   * {
   *   name: string,
   * }
   * @apiSuccess {Json} Returns 200 OK
   * @apiSuccessExample
   * HTTP/1.1 200 OK
   * {
   * }
   *
   */
  Route.patch(UserInfo.Name, 'User/UserProfileController.updateName')

  /**----------------------------------------------------------------------------------------
   * @api {patch} /user/profile/email Update user email
   * @apiUse JWTAuthorization
   * @apiName user-update-email
   * @apiGroup User
   * @apiDescription Updates an existing user email
   * @apiBody {string} email New user's email
   * @apiParamExample {json} Request-Example:
   * {
   *   email: string,
   * }
   * @apiSuccess {Json} Returns 200 OK
   * @apiSuccessExample
   * HTTP/1.1 200 OK
   * {
   * }
   *
   */
  Route.patch(UserInfo.Email, 'User/UserProfileController.updateEmail')

  /**----------------------------------------------------------------------------------------
   * @api {patch} /user/profile/password Update user password
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
  Route.patch(UserInfo.Password, 'User/UserProfileController.updatePassword')
})
  .prefix(USER_PROFILE_API_PATH)
  .middleware('JwtAuth')
