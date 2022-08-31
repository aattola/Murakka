import { Player } from 'discord-player'
import { container, SapphireClient } from '@sapphire/framework'

declare module '@sapphire/pieces' {
  interface Container {
    player: Player
  }
}

function initPlayer(client: SapphireClient) {
  container.player = new Player(client, {
    ytdlOptions: {
      requestOptions: {
        headers: {
          cookie: process.env.YOUTUBE_COOKIE ?? null
        }
      }
    }
  })
}

export { initPlayer }
