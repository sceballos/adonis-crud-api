import Route from '@ioc:Adonis/Core/Route'
import { APIRoutes, APIVersion } from 'App/../start/routes'

export const USER_API_PATH = `${APIVersion.V1}/${APIRoutes.User}`

export enum UserSubRoutes {
  Login = 'login',
  Profile = 'profile',
  Settings = 'settings',
}

/**
 * @apiDefine JWTAuthorization
 * @apiHeader {String} Authorization JWT Token of user provided after successful login
 * @apiHeaderExample {String} JWT Header:
 *  Authorization: Bearer eyJraWQiOi...
 */

Route.group(() => {
  /**----------------------------------------------------------------------------------------
   * @api {post} /user/login Authorize User
   * @apiName user-login
   * @apiGroup User
   * @apiDescription Authorizes a user using username/email and password
   * @apiBody {string} email User email
   * @apiBody {string} password User password
   * @apiParamExample {json} Request-Example:
   * {
   *   email: string,
   *   password: string
   * }
   * @apiSuccess {Json} Returns Object with user access token info and username
   * @apiSuccessExample
   * HTTP/1.1 200 OK
   * {
   *  username: string,
   *  token: string,
   * }
   *
   */
  Route.post(UserSubRoutes.Login, 'User/UsersController.login')

  /**----------------------------------------------------------------------------------------
   * @api {put} /user Create User
   * @apiName user-create
   * @apiGroup User
   * @apiDescription Creates a new user in Database using request body data
   * @apiBody {string} email New user's email
   * @apiBody {string} username New user's username
   * @apiBody {string} password New user's password
   * @apiParamExample {json} Request-Example:
   * {
   *   email: string,
   *   username: string,
   *   password: string
   * }
   * @apiSuccess {Json} Returns 200 OK
   * @apiSuccessExample
   * HTTP/1.1 200 OK
   * {
   * }
   *
   */
  Route.put('', 'User/UsersController.create')

  /**----------------------------------------------------------------------------------------
   * @api {delete} /user Delete user
   * @apiUse JWTAuthorization
   * @apiName user-delete
   * @apiGroup User
   * @apiDescription Deletes user from Database identified by token passed in Authorization header
   * @apiSuccess {Json} Returns 200 OK
   * @apiSuccessExample
   * HTTP/1.1 200 OK
   * {
   * }
   *
   */
  Route.delete('', 'User/UsersController.delete').middleware('JwtAuth')
}).prefix(USER_API_PATH)
