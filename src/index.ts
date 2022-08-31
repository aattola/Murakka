import { SapphireClient } from '@sapphire/framework'

import '@sapphire/plugin-api/register'
import '@sapphire/plugin-logger/register'
import dotenv from 'dotenv'
import { initPlayer } from './player/init'

dotenv.config()

const client = new SapphireClient({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'],
  loadDefaultErrorListeners: false
  // logger: {
  //   level:
  //     process.env.NODE_ENV !== 'production' ? LogLevel.Debug : LogLevel.Info
  // }
})

initPlayer(client)

void client.login(process.env.DISCORD_TOKEN)
