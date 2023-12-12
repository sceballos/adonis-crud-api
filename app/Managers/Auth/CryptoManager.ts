import crypto from 'crypto'

export default class CryptoManager {
  public static GenerateHash(input: string) {
    return crypto.createHash('sha256').update(input).digest('hex')
  }
}
