import { Precondition } from '@sapphire/framework'
import type { CommandInteraction } from 'discord.js'

export class IsPlayingPrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction) {
    const queue = this.container.player.getQueue(interaction.guild!)
    if (!queue)
      return this.error({
        message: 'Mitään ei soi hei. Ootko ihan varma että tiedät mitä teet?',
        context: { ephemeral: true }
      })

    return this.ok()
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    isPlaying: never
  }
}
