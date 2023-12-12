import { test } from '@japa/runner'
import UsersController from 'App/Controllers/Http/User/UserProfileController'
import { USER_API_PATH, UserSubRoutes } from 'App/../start/user'
import UserManager from 'App/Managers/User/UserManager'

const ENDPOINT = `${USER_API_PATH}/${UserSubRoutes.Login}`
const CONTROLLER = `${UsersController.name}`
const ACTION = `AUTHENTICATE user`

const ExistingUserInfo = {
  username: 'existinguser',
  password: 'decentpassword123',
  email: 'existinguser@provider.com',
}

test.group(`${CONTROLLER} | Endpoint : ${ENDPOINT}`, () => {
  /*---------------------------------------------------------------------------------
   *
   * Test form validation
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} without providing email or password.
  Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const response = await client.post(ENDPOINT).form({})
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          rule: 'required',
          field: 'email',
          message: 'Email is required.',
        },
        {
          rule: 'required',
          field: 'password',
          message: 'Password is required.',
        },
      ],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test email validation
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing invalid email.
  Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const response = await client
      .post(ENDPOINT)
      .form({ email: 'not-an-email', password: ExistingUserInfo.password })
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [{ rule: 'email', field: 'email', message: 'Invalid email provided' }],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test successful authentication
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing valid credentials.
   Expects 200 OK with token and username in response body.`, async ({ client, assert }) => {
    const response = await client
      .post(ENDPOINT)
      .form({ email: ExistingUserInfo.email, password: ExistingUserInfo.password })
    response.assertStatus(200)

    assert.isString(response.body().username)
    assert.isString(response.body().token)
  })
    .setup(async () => {
      await UserManager.Create(
        ExistingUserInfo.username,
        ExistingUserInfo.email,
        ExistingUserInfo.password
      )
    })
    .teardown(async () => {
      const existingUser = await UserManager.GetByEmail(ExistingUserInfo.email)
      await UserManager.Delete(existingUser!.id)
    })

  /*---------------------------------------------------------------------------------
   *
   * Test successful authentication
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing invalid credentials.
   Expects 400 Bad Request.`, async ({ client }) => {
    const response = await client
      .post(ENDPOINT)
      .form({ email: ExistingUserInfo.email, password: 'not-valid-password' })
    response.assertStatus(400)
  })
    .setup(async () => {
      await UserManager.Create(
        ExistingUserInfo.username,
        ExistingUserInfo.email,
        ExistingUserInfo.password
      )
    })
    .teardown(async () => {
      const existingUser = await UserManager.GetByEmail(ExistingUserInfo.email)
      await UserManager.Delete(existingUser!.id)
    })
})
