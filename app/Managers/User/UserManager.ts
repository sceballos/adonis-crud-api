import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export interface UpdatableInfo {
  name?: string
  email?: string
  password?: string
}

export default class UserManager {
  /**----------------------------------------------------------------------------------------
   * public static async Create
   * @param name: string
   * @param email: string
   * @param password: string
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
   * @returns Promise<User | null>
   *----------------------------------------------------------------------------------------*/
  public async UpdateUser(id: number, userInfo: UpdatableInfo): Promise<User | null> {
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
}
