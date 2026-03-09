import { Client } from '@jeffe/tankille'

const tankille = new Client(
  {
    device: 'Pixel 7 Pro (f9a9b2d3d4251234)',
    userAgent: 'FuelFellow/3.9.19 (null)'
  },
  { 'User-Agent': 'FuelFellow/3.9.19 (null)' }
)

if (!process.env.TANKILLEPASS) throw new Error('Ei tankille pass env olemassa')
const [email, password] = process.env.TANKILLEPASS.split(':')
void tankille
  .login({
    email,
    password
  })
  .catch((err) => {
    console.error('Tankille login failed:')
    console.dir(err, { depth: 999 })
    console.error('Tankille login failed.')
  })

export { tankille }
