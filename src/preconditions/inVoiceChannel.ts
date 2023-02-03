import { Precondition } from '@sapphire/framework'
import type { CommandInteraction } from 'discord.js'

export class InVoiceChannelPrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) {
      return this.error({
        message: 'Guild ei cachettu (miksi)',
        context: { ephemeral: true }
      })
    }

    if (!interaction.member.voice.channelId)
      return this.error({
        message: 'Liityppä ensin kanavalle',
        context: { ephemeral: true }
      })

    if (!interaction.guild.members.me)
      return this.error({
        message: 'Friikki itsetuntemus häiriö',
        context: { ephemeral: true }
      })

    if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    )
      return this.error({
        message: 'Et ole samalla kanavalla haloo',
        context: { ephemeral: true }
      })

    return this.ok()
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    inVoiceChannel: never
  }
}
