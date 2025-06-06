declare module "bcryptjs" {
  /**
   * Synchronously generates a hash for the given string.
   * @param s The string to hash
   * @param salt The salt length to generate or the salt to use
   */
  export function hashSync(s: string, salt: string | number): string

  /**
   * Synchronously compares the given data against the given hash.
   * @param s The string to compare
   * @param hash The hash to compare to
   */
  export function compareSync(s: string, hash: string): boolean

  /**
   * Generates a salt with the specified number of rounds.
   * @param rounds The number of rounds to use, defaults to 10 if omitted
   * @param callback A callback to be invoked when the salt has been generated
   */
  export function genSalt(rounds?: number, callback?: (err: Error, salt: string) => void): Promise<string>

  /**
   * Synchronously generates a salt with the specified number of rounds.
   * @param rounds The number of rounds to use, defaults to 10 if omitted
   */
  export function genSaltSync(rounds?: number): string

  /**
   * Asynchronously generates a hash for the given string.
   * @param s The string to hash
   * @param salt The salt to use, or the number of rounds to generate a salt
   * @param callback A callback to be invoked when the hash has been generated
   */
  export function hash(s: string, salt: string | number, callback?: (err: Error, hash: string) => void): Promise<string>

  /**
   * Asynchronously compares the given data against the given hash.
   * @param s The string to compare
   * @param hash The hash to compare to
   * @param callback A callback to be invoked when the comparison is complete
   */
  export function compare(s: string, hash: string, callback?: (err: Error, success: boolean) => void): Promise<boolean>

  /**
   * Gets the number of rounds used to encrypt a given hash.
   * @param hash The hash to extract the number of rounds from
   */
  export function getRounds(hash: string): number
}
