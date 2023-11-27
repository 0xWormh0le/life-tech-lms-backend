import { hashingPassword } from '../src/adapter/repositories/shared/PassWordHashing'

const list = ['put your password here', 'as a list of strings']

const main = async () => {
  for (const password of list) {
    const hashed = await hashingPassword(password)
    console.log(hashed)
  }
}

main()
