import { container, SapphireClient } from '@sapphire/framework'

import '@sapphire/plugin-api/register'
import '@sapphire/plugin-logger/register'
import dotenv from 'dotenv'
import { initPlayer } from './init/player'
import { initKeyv } from './init/keyv'
import { initSoittaminen } from './player/soittaminen'
import { initPrisma } from './init/prisma'

import * as Sentry from '@sentry/node'
import '@sentry/tracing'
import * as Tracing from '@sentry/tracing'

import { GatewayIntentBits } from 'discord.js'
import { initInfluxDB } from './init/influxdb'

dotenv.config()

declare module '@sapphire/pieces' {
  interface Container {
    sentry: typeof Sentry
  }
}

const client = new SapphireClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ],
  loadDefaultErrorListeners: false,
  presence: {
    status: 'online'
    // activities: [
    //   {
    //     name: 'RAMSES II AGT ',
    //     type: 'WATCHING'
    //   }
    // ]
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
initInfluxDB()

Sentry.init({
  dsn: 'https://ed8634031d35418f9c86536413fa8986@o124657.ingest.sentry.io/6710413',
  integrations: [new Tracing.Integrations.Prisma({ client: container.prisma })],
  tracesSampleRate: 1.0,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  profilesSampleRate: 1.0
})

container.sentry = Sentry

void client.login(process.env.DISCORD_TOKEN)
