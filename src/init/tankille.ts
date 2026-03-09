import { Client } from '@jeffe/tankille'

const tankille = new Client(
  {
    device: 'Pixel 7 Pro (f9a9b2d3d4251234)',
    userAgent: 'FuelFellow/3.9.19 (null)',
    apiUrl: 'https://tankille-murakka-proxy-416452922840.europe-north1.run.app/'
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
    console.error('Tankille login failed:', err)
    console.log(err.response?.data || err.message)
    console.log(err.reponse)
    console.log(err.headers, 'header')
  })

export { tankille }
