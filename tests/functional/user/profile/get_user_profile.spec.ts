import { test } from '@japa/runner'
import UsersController from 'App/Controllers/Http/User/UserProfileController'
import UserManager from 'App/Managers/User/UserManager'
import AuthManager from 'App/Managers/Auth/AuthManager'
import { USER_PROFILE_API_PATH } from 'App/../start/user/profile'

const ID_PARAM = ':id'
const ENDPOINT = `${USER_PROFILE_API_PATH}/${ID_PARAM}`
const CONTROLLER = `${UsersController.name}`
const ACTION = `GET user profile`

const ExistingUserInfo = {
  username: 'usertoretrieve',
  password: 'decentpassword123',
  email: 'email-get@provider.com',
}

test.group(`${CONTROLLER} | Endpoint : ${ENDPOINT}`, (group) => {
  let authToken = ''
  let userId = -1
  group
    .setup(async () => {
      const user = await UserManager.Create(
        ExistingUserInfo.username,
        ExistingUserInfo.email,
        ExistingUserInfo.password
      )

      authToken = AuthManager.GenerateToken(user!.id)
      userId = user!.id
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
    const response = await client.get(ENDPOINT)
    response.assertStatus(401)
  })

  /*---------------------------------------------------------------------------------
   *
   * Test authorization header validation (invalid)
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} providing invalid JWT token in header.
  Expects 401 Unauthorized `, async ({ client }) => {
    const response = await client.get(ENDPOINT).bearerToken('im-a-invalid-token')
    response.assertStatus(401)
  })

  /*---------------------------------------------------------------------------------
   *
   * Test get user profile but providing string id in URL params
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} providing valid JWT token but providing string id in URL.
    Expects 400 Bad Request`, async ({ client, assert }) => {
    const response = await client
      .get(ENDPOINT.replace(ID_PARAM, 'imastringid'))
      .bearerToken(authToken)
    response.assertStatus(400)

    assert.deepEqual(response.body(), {
      error: 'Invalid user id provided.',
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test get profile of inexistent user
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} providing valid JWT token of inexistent user.
  Expects 400 Bad Request`, async ({ client, assert }) => {
    const response = await client.get(ENDPOINT.replace(ID_PARAM, `487231`)).bearerToken(authToken)
    response.assertStatus(400)

    assert.deepEqual(response.body(), {
      error: 'User not found.',
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test get user profile
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} providing valid JWT token.
  Expects 200 OK`, async ({ client, assert }) => {
    const response = await client
      .get(ENDPOINT.replace(ID_PARAM, `${userId}`))
      .bearerToken(authToken)
    response.assertStatus(200)

    assert.deepEqual(response.body(), {
      username: ExistingUserInfo.username,
      email: ExistingUserInfo.email,
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test get different user profile
   *
   * ----------------------------------------------------------------------------------*/
  {
    const DifferentUserInfo = {
      username: 'differentuser',
      password: 'decentpassword123',
      email: 'email-different-get@provider.com',
    }

    let differentUserId = -1
    test(`${CONTROLLER} => ${ACTION} providing valid JWT token and requesting a different user.
Expects 200 OK`, async ({ client, assert }) => {
      const response = await client
        .get(ENDPOINT.replace(ID_PARAM, `${differentUserId}`))
        .bearerToken(authToken)
      response.assertStatus(200)

      assert.deepEqual(response.body(), {
        username: DifferentUserInfo.username,
        email: DifferentUserInfo.email,
      })
    })
      .setup(async () => {
        const differentUser = await UserManager.Create(
          DifferentUserInfo.username,
          DifferentUserInfo.email,
          DifferentUserInfo.password
        )
        differentUserId = differentUser!.id
      })
      .teardown(async () => {
        const existingUser = await UserManager.GetByEmail(DifferentUserInfo.email)
        if (existingUser) {
          await UserManager.Delete(existingUser!.id)
        }
      })
  }
})
