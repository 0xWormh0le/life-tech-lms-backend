const bcrypt = require('bcrypt')

export const hashingPassword = async (password: string): Promise<string> => {
  const saltRounds = 10

  // With "salt round" they actually mean the cost factor. The cost factor controls how much time is needed to calculate a single BCrypt hash. The higher the cost factor, the more hashing rounds are done. Increasing the cost factor by 1 doubles the necessary time. The more time is necessary, the more difficult is brute-forcing.
  try {
    const salt = await bcrypt.genSalt(saltRounds)

    password = await bcrypt.hash(password, salt)

    return password
  } catch (err) {
    throw new Error(
      `Error occured at the time of Hashing the password in bcrypt ${JSON.stringify(
        err,
      )}`,
    )
  }
}

export const comparingHashedPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean | undefined> => {
  try {
    const validPassword = await bcrypt.compare(password, hashedPassword)

    return validPassword
  } catch (err) {
    throw new Error(
      `Error occured at the time of comparing the password from bcrypt ${JSON.stringify(
        err,
      )}`,
    )
  }
}
