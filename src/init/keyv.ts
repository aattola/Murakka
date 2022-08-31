import Keyv from 'keyv'
import { container } from '@sapphire/framework'

declare module '@sapphire/pieces' {
  interface Container {
    keyv: Keyv<any, Record<string, unknown>>
  }
}

function initKeyv() {
  const keyv = new Keyv(process.env.REDIS_URL)

  container.keyv = keyv
  keyv.on('error', () => console.log('keyv init error'))
}

export { initKeyv }
