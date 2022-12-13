import { Client } from '@jeffe/tankille'

const tankille = new Client()

if (!process.env.TANKILLEPASS) throw new Error('Ei tankille pass env olemassa')
const [email, password] = process.env.TANKILLEPASS.split(':')
void tankille.login({
  email,
  password
})

export { tankille }
