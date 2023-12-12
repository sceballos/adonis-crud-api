import { test } from '@japa/runner'
import UsersController from 'App/Controllers/Http/User/UserProfileController'
import UserManager from 'App/Managers/User/UserManager'
import AuthManager from 'App/Managers/Auth/AuthManager'
import { USER_PROFILE_API_PATH, UserInfo } from 'App/../start/user/profile'

const ENDPOINT = `${USER_PROFILE_API_PATH}/${UserInfo.Name}`
const CONTROLLER = `${UsersController.name}`
const ACTION = `UPDATE user name`

const ExistingUserInfo = {
  username: 'usertoupdate',
  password: 'decentpassword123',
  email: 'email-update-name@provider.com',
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
   * Test update of user name without providing name parameter
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} providing valid JWT token but without providing name parameter.
  Expects 422 Unprocessable Entity `, async ({ client, assert }) => {
    const response = await client.patch(ENDPOINT).bearerToken(authToken)
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          rule: 'required',
          field: 'name',
          message: 'Name is required.',
        },
      ],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test update of user name providing short name parameter
   *
   * ----------------------------------------------------------------------------------*/
  {
    const newName = 'user'
    test(`${CONTROLLER} => ${ACTION} providing valid JWT token and invalid name parameter (short name).
  Expects 200 OK `, async ({ client, assert }) => {
      const response = await client
        .patch(ENDPOINT)
        .form({
          name: newName,
        })
        .bearerToken(authToken)

      response.assertStatus(422)

      assert.deepEqual(response.body(), {
        errors: [
          {
            args: {
              minLength: 5,
            },
            rule: 'minLength',
            field: 'name',
            message: 'Name should be at least 5 characters long.',
          },
        ],
      })
    })

    /*---------------------------------------------------------------------------------
     *
     * Test update of user name providing long name parameter
     *
     * ----------------------------------------------------------------------------------*/
    {
      const newName =
        'ajwkjntpvrfgdytqcyujuuadbppzwqvvwzbjucrpcbcbipdkavmiimpbnjnumyuppynanaxzwkbrfihczgdjweqxhzcxjbkkjvaewtehcrpgwkxfazzpjppiwuuazwzfg'
      test(`${CONTROLLER} => ${ACTION} providing valid JWT token and invalid name parameter (long name).
  Expects 200 OK `, async ({ client, assert }) => {
        const response = await client
          .patch(ENDPOINT)
          .form({
            name: newName,
          })
          .bearerToken(authToken)

        response.assertStatus(422)

        assert.deepEqual(response.body(), {
          errors: [
            {
              args: {
                maxLength: 128,
              },
              rule: 'maxLength',
              field: 'name',
              message: 'Name should be at most 128 characters long.',
            },
          ],
        })
      })
    }
  }

  /*---------------------------------------------------------------------------------
   *
   * Test successful update of user name
   *
   * ----------------------------------------------------------------------------------*/
  {
    const newName = 'newnameofuser'
    test(`${CONTROLLER} => ${ACTION} providing valid JWT token and valid name parameter.
  Expects 200 OK `, async ({ client, assert }) => {
      const response = await client
        .patch(ENDPOINT)
        .form({
          name: newName,
        })
        .bearerToken(authToken)

      response.assertStatus(200)

      const updatedUser = await UserManager.GetByEmail(ExistingUserInfo.email)

      assert.deepEqual(updatedUser!.name, newName)
    })
  }
})
