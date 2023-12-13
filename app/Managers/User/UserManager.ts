import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import CryptoManager from '../Auth/CryptoManager'
export interface UpdatableInfo {
  name?: string
  email?: string
}

export default class UserManager {
  /**----------------------------------------------------------------------------------------
   * public static async Authenticate
   * @param email: string
   * @param password: string
   * @description Verifies that email and password are correct during authentication phase.
   * @returns Promise<User | null>
   *----------------------------------------------------------------------------------------*/
  public static async Authenticate(email: string, password: string): Promise<User | null> {
    return await User.query()
      .select()
      .where('email', email)
      .andWhere('password', CryptoManager.GenerateHash(password))
      .first()
  }

  /**----------------------------------------------------------------------------------------
   * public static async GetByEmail
   * @param email: string
   * @description Returns a User from DB identified by email. Returns null if user doesn't exists
   * @returns Promise<User | null>
   *----------------------------------------------------------------------------------------*/
  public static async GetByEmail(email: string): Promise<User | null> {
    return await User.findBy('email', email)
  }

  /**----------------------------------------------------------------------------------------
   * public static async GetByID
   * @param id: number
   * @description Returns a User from DB identified by ID. Returns null if user doesn't exists
   * @returns Promise<User | null>
   *----------------------------------------------------------------------------------------*/
  public static async GetByID(id: number): Promise<User | null> {
    return await User.find(id)
  }

  /**----------------------------------------------------------------------------------------
   * public static async Create
   * @param name: string
   * @param email: string
   * @param password: string
   * @description Creates a User using passed parameters in DB and returns it. Returns null if creation fails
   * @returns Promise<User | null>
   *----------------------------------------------------------------------------------------*/
  public static async Create(name: string, email: string, password: string): Promise<User | null> {
    const newUser = new User()

    newUser.name = name
    newUser.email = email
    newUser.password = password

    const trx = await Database.transaction()

    newUser.useTransaction(trx)

    try {
      await newUser.save()
      await trx.commit()
      return newUser
    } catch (error) {
      console.error(error)
      await trx.rollback()
      return null
    }
  }

  /**----------------------------------------------------------------------------------------
   * public static async Delete
   * @param id: number
   * @description Deletes a User from DB using ID. Returns null if deletion fails
   * @returns Promise<User | null>
   *----------------------------------------------------------------------------------------*/
  public static async Delete(id: number): Promise<User | null> {
    const userToDelete = await User.find(id)

    if (!userToDelete) {
      return null
    }

    const trx = await Database.transaction()
    userToDelete.useTransaction(trx)

    try {
      await userToDelete.delete()
      await trx.commit()
      return userToDelete
    } catch (error) {
      console.error(error)
      await trx.rollback()
      return null
    }
  }

  /**----------------------------------------------------------------------------------------
   * public static async UpdateUser
   * @param id: number
   * @param userInfo: UpdatableInfo
   * @description Updates a User info (name, email) in DB using passed parameters. Returns null if update fails
   * @returns Promise<User | null>
   *----------------------------------------------------------------------------------------*/
  public static async UpdateUser(id: number, userInfo: UpdatableInfo): Promise<User | null> {
    const userToUpdate = await User.find(id)

    if (!userToUpdate) {
      return null
    }

    const trx = await Database.transaction()

    await userToUpdate
      .merge({
        ...userInfo,
      })
      .useTransaction(trx)
      .save()

    try {
      await trx.commit()
      return userToUpdate
    } catch (error) {
      console.error(error)
      await trx.rollback()
      return null
    }
  }

  /**----------------------------------------------------------------------------------------
   * public static async UpdateUserPassword
   * @param id: number
   * @param newPassword: string
   * @description Updates a User password in DB using passed parameters. Returns null if update fails
   * @returns Promise<User | null>
   *----------------------------------------------------------------------------------------*/
  public static async UpdateUserPassword(id: number, newPassword: string): Promise<User | null> {
    const userToUpdate = await User.find(id)

    if (!userToUpdate) {
      return null
    }

    const trx = await Database.transaction()
    userToUpdate.password = newPassword
    userToUpdate.useTransaction(trx)

    try {
      await userToUpdate.save()
      await trx.commit()
      return userToUpdate
    } catch (error) {
      console.error(error)
      await trx.rollback()
      return null
    }
  }
}
