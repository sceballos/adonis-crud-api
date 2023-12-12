import { test } from '@japa/runner'
import UsersController from 'App/Controllers/Http/User/UserProfileController'
import { USER_API_PATH } from 'App/../start/user'
import UserManager from 'App/Managers/User/UserManager'
import AuthManager from 'App/Managers/Auth/AuthManager'

const ENDPOINT = `${USER_API_PATH}`
const CONTROLLER = `${UsersController.name}`
const ACTION = `DELETE user`

const ExistingUserInfo = {
  username: 'usertodelete',
  password: 'decentpassword123',
  email: 'email-delete@provider.com',
}

test.group(`${CONTROLLER} | Endpoint : ${ENDPOINT}`, (group) => {
  let authToken = ''
  group
    .setup(async () => {
      const user = await UserManager.Create(
        ExistingUserInfo.username,
        ExistingUserInfo.email,
        ExistingUserInfo.password
      )

      authToken = AuthManager.GenerateToken(user!.id)
    })
    .teardown(async () => {
      const existingUser = await UserManager.GetByEmail(ExistingUserInfo.email)
      if (existingUser) {
        await UserManager.Delete(existingUser!.id)
      }
    })
  /*---------------------------------------------------------------------------------
   *
   * Test authorization header validation (empty)
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} without providing authorization header.
  Expects 401 Unauthorized `, async ({ client }) => {
    const response = await client.delete(ENDPOINT)
    response.assertStatus(401)
  })

  /*---------------------------------------------------------------------------------
   *
   * Test authorization header validation (invalid)
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} providing invalid JWT token in header.
  Expects 401 Unauthorized `, async ({ client }) => {
    const response = await client.delete(ENDPOINT).bearerToken('im-a-invalid-token')
    response.assertStatus(401)
  })

  /*---------------------------------------------------------------------------------
   *
   * Test successful deletion of user
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} providing valid JWT token.
  Expects 200 OK `, async ({ client }) => {
    const response = await client.delete(ENDPOINT).bearerToken(authToken)
    response.assertStatus(200)
  })
})
