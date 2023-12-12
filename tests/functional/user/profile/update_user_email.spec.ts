import { test } from '@japa/runner'
import UsersController from 'App/Controllers/Http/User/UserProfileController'
import UserManager from 'App/Managers/User/UserManager'
import AuthManager from 'App/Managers/Auth/AuthManager'
import { USER_PROFILE_API_PATH, UserInfo } from 'App/../start/user/profile'

const ENDPOINT = `${USER_PROFILE_API_PATH}/${UserInfo.Email}`
const CONTROLLER = `${UsersController.name}`
const ACTION = `UPDATE user email`

const ExistingUserInfo = {
  username: 'usertoupdateemail',
  password: 'decentpassword123',
  email: 'email-update-email@provider.com',
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
    const response = await client.patch(ENDPOINT)
    response.assertStatus(401)
  })

  /*---------------------------------------------------------------------------------
   *
   * Test authorization header validation (invalid)
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} providing invalid JWT token in header.
  Expects 401 Unauthorized `, async ({ client }) => {
    const response = await client.patch(ENDPOINT).bearerToken('im-a-invalid-token')
    response.assertStatus(401)
  })

  /*---------------------------------------------------------------------------------
   *
   * Test update of user email without providing email parameter
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} providing valid JWT token but without providing email parameter.
  Expects 422 Unprocessable Entity `, async ({ client, assert }) => {
    const response = await client.patch(ENDPOINT).bearerToken(authToken)
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          rule: 'required',
          field: 'email',
          message: 'Email is required.',
        },
      ],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test update of user email providing invalid email parameter
   *
   * ----------------------------------------------------------------------------------*/
  {
    const newEmail = 'invalid-email'
    test(`${CONTROLLER} => ${ACTION} providing valid JWT token and invalid email parameter.
  Expects 422 Unprocessable Entity `, async ({ client, assert }) => {
      const response = await client
        .patch(ENDPOINT)
        .form({
          email: newEmail,
        })
        .bearerToken(authToken)

      response.assertStatus(422)

      assert.deepEqual(response.body(), {
        errors: [{ rule: 'email', field: 'email', message: 'Invalid email provided' }],
      })
    })
  }

  /*---------------------------------------------------------------------------------
   *
   * Test successful update of user email
   *
   * ----------------------------------------------------------------------------------*/
  {
    const newEmail = 'validnewemailtesting@provider.com'
    test(`${CONTROLLER} => ${ACTION} providing valid JWT token and valid email parameter.
  Expects 200 OK `, async ({ client, assert }) => {
      const response = await client
        .patch(ENDPOINT)
        .form({
          email: newEmail,
        })
        .bearerToken(authToken)

      response.assertStatus(200)

      const updatedUser = await UserManager.GetByEmail(newEmail)

      assert.isNotNull(updatedUser)
    }).teardown(async () => {
      const existingUser = await UserManager.GetByEmail(newEmail)
      if (existingUser) {
        await UserManager.Delete(existingUser!.id)
      }
    })
  }
})
