import { test } from '@japa/runner'
import UsersController from 'App/Controllers/Http/User/UserProfileController'
import UserManager from 'App/Managers/User/UserManager'
import AuthManager from 'App/Managers/Auth/AuthManager'
import { USER_PROFILE_API_PATH, UserInfo } from 'App/../start/user/profile'
import CryptoManager from 'App/Managers/Auth/CryptoManager'

const ENDPOINT = `${USER_PROFILE_API_PATH}/${UserInfo.Password}`
const CONTROLLER = `${UsersController.name}`
const ACTION = `UPDATE user password`

const ExistingUserInfo = {
  username: 'usertoupdatepassword',
  password: 'decentpassword123',
  email: 'email-update-password@provider.com',
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
   * Test form validation
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} without providing current password or new password.
  Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const response = await client.patch(ENDPOINT).bearerToken(authToken).form({})
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          rule: 'required',
          field: 'current_password',
          message: 'Current password is required.',
        },
        {
          rule: 'required',
          field: 'new_password',
          message: 'New password is required.',
        },
        {
          rule: 'required',
          field: 'new_password_repeat',
          message: 'New password repeat is required.',
        },
      ],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test password length validation (minLength)
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing a short new password.
   Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const shortPass = 'short'
    const response = await client.patch(ENDPOINT).bearerToken(authToken).form({
      current_password: ExistingUserInfo.password,
      new_password: shortPass,
      new_password_repeat: shortPass,
    })
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          args: {
            minLength: 8,
          },
          rule: 'minLength',
          field: 'new_password',
          message: 'New password should be at least 8 characters long.',
        },
      ],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test password length validation (maxLength)
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing a very long new password.
   Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const longPass =
      'abcix7G.Knva=Ux!TyT!nXuRW:F5y*.PaQk}D#[)qDND2i/P#?4BMxWiwN}}y%/$uXjv#?Dm}%Yj:gqGng_Dbbz#+i1:@e!55ice;-PaQXDe{PJh%.=rV;kYQ$#W*6!HK].cY0mWt{4kp4vLjxEf.Yp+L&Em+hhLe#vDPe%h?u7)&1a,0nvimMt;KPt9Q)(N.4)zfiq)}p5M1hh+/e47:m;1]XC@G)5p$t4&F_qJLkN6y*?G]!]&Ynk3mkj5PHt#?F)Fu61dW7ij-WcAY=eNNJBh/GUSNDDDWjexhv.iPfPT4bzW[u0@c}M{6Dpw/q_1M?k[2?B_N_Q7K?6XrNN%e]j-abcix7G.Knva=Ux!TyT!nXuRW:F5y*.PaQk}D#[)qDND2i/P#?4BMxWiwN}}y%/$uXjv#?Dm}%Yj:gqGng_Dbbz#+i1:@e!55ice;-PaQXDe{PJh%.=rV;kYQ$#W*6!HK].cY0mWt{4kp4vLjxEf.Yp+L&Em+hhLe#vDPe%h?u7)&1a,0nvimMt;KPt9Q)(N.4)zfiq)}p5M1hh+/e47:m;1]XC@G)5p$t4&F_qJLkN6y*?G]!]&Ynk3mkj5PHt#?F)Fu61dW7ij-WcAY=eNNJBh/GUSNDDDWjexhv.iPfPT4bzW[u0@c}M{6Dpw/q_1M?k[2?B_N_Q7K?6XrNN%e]j-'
    const response = await client.patch(ENDPOINT).bearerToken(authToken).form({
      current_password: ExistingUserInfo.password,
      new_password: longPass,
      new_password_repeat: longPass,
    })
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          args: {
            maxLength: 512,
          },
          rule: 'maxLength',
          field: 'new_password',
          message: 'New password should be at most 512 characters long.',
        },
      ],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test password length validation (minLength)
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing a short current password.
   Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const shortPass = 'short'
    const response = await client.patch(ENDPOINT).bearerToken(authToken).form({
      current_password: shortPass,
      new_password: 'longenoughpass',
      new_password_repeat: 'longenoughpass',
    })
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          args: {
            minLength: 8,
          },
          rule: 'minLength',
          field: 'current_password',
          message: 'Current password should be at least 8 characters long.',
        },
      ],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test password length validation (maxLength)
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing a very long current password.
   Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const longPass =
      'abcix7G.Knva=Ux!TyT!nXuRW:F5y*.PaQk}D#[)qDND2i/P#?4BMxWiwN}}y%/$uXjv#?Dm}%Yj:gqGng_Dbbz#+i1:@e!55ice;-PaQXDe{PJh%.=rV;kYQ$#W*6!HK].cY0mWt{4kp4vLjxEf.Yp+L&Em+hhLe#vDPe%h?u7)&1a,0nvimMt;KPt9Q)(N.4)zfiq)}p5M1hh+/e47:m;1]XC@G)5p$t4&F_qJLkN6y*?G]!]&Ynk3mkj5PHt#?F)Fu61dW7ij-WcAY=eNNJBh/GUSNDDDWjexhv.iPfPT4bzW[u0@c}M{6Dpw/q_1M?k[2?B_N_Q7K?6XrNN%e]j-abcix7G.Knva=Ux!TyT!nXuRW:F5y*.PaQk}D#[)qDND2i/P#?4BMxWiwN}}y%/$uXjv#?Dm}%Yj:gqGng_Dbbz#+i1:@e!55ice;-PaQXDe{PJh%.=rV;kYQ$#W*6!HK].cY0mWt{4kp4vLjxEf.Yp+L&Em+hhLe#vDPe%h?u7)&1a,0nvimMt;KPt9Q)(N.4)zfiq)}p5M1hh+/e47:m;1]XC@G)5p$t4&F_qJLkN6y*?G]!]&Ynk3mkj5PHt#?F)Fu61dW7ij-WcAY=eNNJBh/GUSNDDDWjexhv.iPfPT4bzW[u0@c}M{6Dpw/q_1M?k[2?B_N_Q7K?6XrNN%e]j-'
    const response = await client.patch(ENDPOINT).bearerToken(authToken).form({
      current_password: longPass,
      new_password: 'longenoughpass',
      new_password_repeat: 'longenoughpass',
    })
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          args: {
            maxLength: 512,
          },
          rule: 'maxLength',
          field: 'current_password',
          message: 'Current password should be at most 512 characters long.',
        },
      ],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test current user password match
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} but providing incorrect current user password.
  Expects 400 Bad Request`, async ({ client, assert }) => {
    const response = await client.patch(ENDPOINT).bearerToken(authToken).form({
      current_password: 'invalidpassword',
      new_password: 'longenoughpass',
      new_password_repeat: 'longenoughpass',
    })
    response.assertStatus(400)

    assert.deepEqual(response.body(), {
      error: 'Current password is incorrect.',
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test new user password match
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} but providing non-matching new user password.
  Expects 400 Bad Request`, async ({ client, assert }) => {
    const response = await client.patch(ENDPOINT).bearerToken(authToken).form({
      current_password: ExistingUserInfo.password,
      new_password: 'longenoughpass',
      new_password_repeat: 'longenoughpassbutdifferent',
    })
    response.assertStatus(400)

    assert.deepEqual(response.body(), {
      error: 'New password does not match.',
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test update user password successfully
   *
   * ----------------------------------------------------------------------------------*/
  {
    const newPassword = 'longenoughpass'
    test(`${CONTROLLER} => ${ACTION} providing valid body.
  Expects 200 OK`, async ({ client, assert }) => {
      const response = await client.patch(ENDPOINT).bearerToken(authToken).form({
        current_password: ExistingUserInfo.password,
        new_password: newPassword,
        new_password_repeat: newPassword,
      })
      response.assertStatus(200)

      const existingUser = await UserManager.GetByEmail(ExistingUserInfo.email)
      assert.deepEqual(existingUser?.password, CryptoManager.GenerateHash(newPassword))
    })
  }
})
