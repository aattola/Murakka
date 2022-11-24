import { container, SapphireClient } from '@sapphire/framework'

import '@sapphire/plugin-api/register'
import '@sapphire/plugin-logger/register'
import dotenv from 'dotenv'
import { initPlayer } from './init/player'
import { initKeyv } from './init/keyv'
import { initSoittaminen } from './player/soittaminen'
import { initPrisma } from './init/prisma'

dotenv.config()

const client = new SapphireClient({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'],
  loadDefaultErrorListeners: false,
  presence: {
    status: 'online',
    activities: [
      {
        name: 'RAMSES II AGT ',
        type: 'WATCHING'
      }
    ]
  }
  // logger: {
  //   level:
  //     process.env.NODE_ENV !== 'production' ? LogLevel.Debug : LogLevel.Info
  // }
})

initPrisma()
initPlayer(client)
initKeyv()
initSoittaminen(container.player)

void client.login(process.env.DISCORD_TOKEN)
