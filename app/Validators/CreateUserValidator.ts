import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    email: schema.string({}, [rules.email(), rules.minLength(1), rules.maxLength(128)]),
    username: schema.string({}, [rules.minLength(5), rules.maxLength(128)]),
    password: schema.string({}, [rules.minLength(8), rules.maxLength(512)]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'username.required': `Username is required.`,
    'password.required': `Password is required.`,
    'email.required': `Email is required.`,
    'email.email': `Invalid email provided`,
    'username.minLength': `Username should be at least 5 characters long.`,
    'username.maxLength': `Username should be at most 128 characters long.`,
    'password.minLength': `Password should be at least 8 characters long.`,
    'password.maxLength': `Password should be at most 512 characters long.`,
  }
}
