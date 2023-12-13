import crypto from 'crypto'

export default class CryptoManager {
  /**----------------------------------------------------------------------------------------
   * public static GenerateHash
   * @param input: string
   * @description Generates and returns a SHA256 hash.
   * @returns string
   *----------------------------------------------------------------------------------------*/
  public static GenerateHash(input: string) {
    return crypto.createHash('sha256').update(input).digest('hex')
  }
}
