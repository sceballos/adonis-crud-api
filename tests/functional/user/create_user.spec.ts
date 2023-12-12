import { test } from '@japa/runner'
import UsersController from 'App/Controllers/Http/User/UserProfileController'
import { USER_API_PATH } from 'App/../start/user'
import UserManager from 'App/Managers/User/UserManager'

const ENDPOINT = `${USER_API_PATH}`
const CONTROLLER = `${UsersController.name}`
const ACTION = `CREATE user`

const newUserInfo = {
  username: 'validusername',
  password: 'decentpassword123',
  email: 'email@provider.com',
}

test.group(`${CONTROLLER} | Endpoint : ${ENDPOINT}`, () => {
  /*---------------------------------------------------------------------------------
   *
   * Test form validation
   *
   * ----------------------------------------------------------------------------------*/
  test(`${CONTROLLER} => ${ACTION} without providing username, email or password.
  Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const response = await client.put(ENDPOINT).form({})
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        { rule: 'required', field: 'email', message: 'Email is required.' },
        {
          rule: 'required',
          field: 'username',
          message: 'Username is required.',
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
   * Test password length validation (minLength)
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing a short password.
   Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const response = await client
      .put(ENDPOINT)
      .form({ username: 'validusername', password: 'short', email: 'email@provider.com' })
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          args: {
            minLength: 8,
          },
          rule: 'minLength',
          field: 'password',
          message: 'Password should be at least 8 characters long.',
        },
      ],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test password length validation (maxLength)
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing a very long password.
   Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const longPass =
      'abcix7G.Knva=Ux!TyT!nXuRW:F5y*.PaQk}D#[)qDND2i/P#?4BMxWiwN}}y%/$uXjv#?Dm}%Yj:gqGng_Dbbz#+i1:@e!55ice;-PaQXDe{PJh%.=rV;kYQ$#W*6!HK].cY0mWt{4kp4vLjxEf.Yp+L&Em+hhLe#vDPe%h?u7)&1a,0nvimMt;KPt9Q)(N.4)zfiq)}p5M1hh+/e47:m;1]XC@G)5p$t4&F_qJLkN6y*?G]!]&Ynk3mkj5PHt#?F)Fu61dW7ij-WcAY=eNNJBh/GUSNDDDWjexhv.iPfPT4bzW[u0@c}M{6Dpw/q_1M?k[2?B_N_Q7K?6XrNN%e]j-abcix7G.Knva=Ux!TyT!nXuRW:F5y*.PaQk}D#[)qDND2i/P#?4BMxWiwN}}y%/$uXjv#?Dm}%Yj:gqGng_Dbbz#+i1:@e!55ice;-PaQXDe{PJh%.=rV;kYQ$#W*6!HK].cY0mWt{4kp4vLjxEf.Yp+L&Em+hhLe#vDPe%h?u7)&1a,0nvimMt;KPt9Q)(N.4)zfiq)}p5M1hh+/e47:m;1]XC@G)5p$t4&F_qJLkN6y*?G]!]&Ynk3mkj5PHt#?F)Fu61dW7ij-WcAY=eNNJBh/GUSNDDDWjexhv.iPfPT4bzW[u0@c}M{6Dpw/q_1M?k[2?B_N_Q7K?6XrNN%e]j-'
    const response = await client
      .put(ENDPOINT)
      .form({ username: 'validusername', password: longPass, email: 'email@provider.com' })
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          args: {
            maxLength: 512,
          },
          rule: 'maxLength',
          field: 'password',
          message: 'Password should be at most 512 characters long.',
        },
      ],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test username length validation (minLength)
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing a short username.
  Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const response = await client
      .put(ENDPOINT)
      .form({ username: 'abc', password: 'decentpassword', email: 'email@provider.com' })
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          args: {
            minLength: 5,
          },
          rule: 'minLength',
          field: 'username',
          message: 'Username should be at least 5 characters long.',
        },
      ],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test username length validation (maxLength)
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing a long username.
  Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const longUsername =
      'ajwkjntpvrfgdytqcyujuuadbppzwqvvwzbjucrpcbcbipdkavmiimpbnjnumyuppynanaxzwkbrfihczgdjweqxhzcxjbkkjvaewtehcrpgwkxfazzpjppiwuuazwzfg'
    const response = await client.put(ENDPOINT).form({
      username: longUsername,
      password: 'decentpassword',
      email: 'email@provider.com',
    })
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          args: {
            maxLength: 128,
          },
          rule: 'maxLength',
          field: 'username',
          message: 'Username should be at most 128 characters long.',
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
      .put(ENDPOINT)
      .form({ username: 'validusername', password: 'decentpassword123', email: 'not-an-email' })
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [{ rule: 'email', field: 'email', message: 'Invalid email provided' }],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test password length validation (minLength)
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing a short password.
  Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const response = await client
      .put(ENDPOINT)
      .form({ username: 'validusername', password: 'short', email: 'email@provider.com' })
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          args: {
            minLength: 8,
          },
          rule: 'minLength',
          field: 'password',
          message: 'Password should be at least 8 characters long.',
        },
      ],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test password length validation (maxLength)
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing a very long password.
  Expects 422 Unprocessable Entity along with object containing array of errors `, async ({
    client,
    assert,
  }) => {
    const longPass =
      'abcix7G.Knva=Ux!TyT!nXuRW:F5y*.PaQk}D#[)qDND2i/P#?4BMxWiwN}}y%/$uXjv#?Dm}%Yj:gqGng_Dbbz#+i1:@e!55ice;-PaQXDe{PJh%.=rV;kYQ$#W*6!HK].cY0mWt{4kp4vLjxEf.Yp+L&Em+hhLe#vDPe%h?u7)&1a,0nvimMt;KPt9Q)(N.4)zfiq)}p5M1hh+/e47:m;1]XC@G)5p$t4&F_qJLkN6y*?G]!]&Ynk3mkj5PHt#?F)Fu61dW7ij-WcAY=eNNJBh/GUSNDDDWjexhv.iPfPT4bzW[u0@c}M{6Dpw/q_1M?k[2?B_N_Q7K?6XrNN%e]j-abcix7G.Knva=Ux!TyT!nXuRW:F5y*.PaQk}D#[)qDND2i/P#?4BMxWiwN}}y%/$uXjv#?Dm}%Yj:gqGng_Dbbz#+i1:@e!55ice;-PaQXDe{PJh%.=rV;kYQ$#W*6!HK].cY0mWt{4kp4vLjxEf.Yp+L&Em+hhLe#vDPe%h?u7)&1a,0nvimMt;KPt9Q)(N.4)zfiq)}p5M1hh+/e47:m;1]XC@G)5p$t4&F_qJLkN6y*?G]!]&Ynk3mkj5PHt#?F)Fu61dW7ij-WcAY=eNNJBh/GUSNDDDWjexhv.iPfPT4bzW[u0@c}M{6Dpw/q_1M?k[2?B_N_Q7K?6XrNN%e]j-'
    const response = await client
      .put(ENDPOINT)
      .form({ username: 'validusername', password: longPass, email: 'email@provider.com' })
    response.assertStatus(422)

    assert.deepEqual(response.body(), {
      errors: [
        {
          args: {
            maxLength: 512,
          },
          rule: 'maxLength',
          field: 'password',
          message: 'Password should be at most 512 characters long.',
        },
      ],
    })
  })

  /*---------------------------------------------------------------------------------
   *
   * Test successful registration
   *
   * ----------------------------------------------------------------------------------*/

  test(`${CONTROLLER} => ${ACTION} providing valid parameters.
  Expects 200 OK`, async ({ client, assert }) => {
    const response = await client.put(ENDPOINT).form({
      username: newUserInfo.username,
      password: newUserInfo.password,
      email: newUserInfo.email,
    })

    assert.deepEqual(response.status(), 200)
  }).teardown(async () => {
    const existingUser = await UserManager.GetByEmail(newUserInfo.email)
    await UserManager.Delete(existingUser!.id)
  })

  /*---------------------------------------------------------------------------------
   *
   * Test duplicated registration
   *
   * ----------------------------------------------------------------------------------*/

  {
    const duplicatedUser = {
      username: 'validusername',
      password: 'decentpassword123',
      email: 'email-to-test@provider.com',
    }
    test(`${CONTROLLER} => ${ACTION} providing valid parameters but user already exists.
  Expects 400 Bad request`, async ({ client, assert }) => {
      const response = await client.put(ENDPOINT).form({
        username: duplicatedUser.username,
        password: duplicatedUser.password,
        email: duplicatedUser.email,
      })

      assert.deepEqual(response.status(), 400)
    })
      .setup(async () => {
        await UserManager.Create(
          duplicatedUser.username,
          duplicatedUser.email,
          duplicatedUser.password
        )
      })
      .teardown(async () => {
        const existingUser = await UserManager.GetByEmail(duplicatedUser.email)
        await UserManager.Delete(existingUser!.id)
      })
  }
})
