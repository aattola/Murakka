import { LogLevel, SapphireClient } from '@sapphire/framework'

import '@sapphire/plugin-api/register'
import '@sapphire/plugin-logger/register'
import dotenv from 'dotenv'

dotenv.config()

const client = new SapphireClient({
  intents: ['GUILDS', 'GUILD_MESSAGES'],
  logger: {
    level:
      process.env.NODE_ENV === 'development' ? LogLevel.Debug : LogLevel.Info
  }
})

void client.login(process.env.DISCORD_TOKEN)
