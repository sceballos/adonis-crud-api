import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserPasswordValidator {
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
    current_password: schema.string({}, [rules.minLength(8), rules.maxLength(512)]),
    new_password: schema.string({}, [rules.minLength(8), rules.maxLength(512)]),
    new_password_repeat: schema.string({}),
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
    'current_password.required': `Current password is required.`,
    'current_password.minLength': `Current password should be at least 8 characters long.`,
    'current_password.maxLength': `Current password should be at most 512 characters long.`,

    'new_password.required': `New password is required.`,
    'new_password.minLength': `New password should be at least 8 characters long.`,
    'new_password.maxLength': `New password should be at most 512 characters long.`,

    'new_password_repeat.required': `New password repeat is required.`,
  }
}
