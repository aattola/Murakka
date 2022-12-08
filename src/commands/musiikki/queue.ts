import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { MessageEmbed } from 'discord.js'

@ApplyOptions<Command.Options>({
  name: 'queue',
  description: 'Mitä jonossa on?',
  requiredClientPermissions: ['CONNECT', 'VIEW_CHANNEL'],
  preconditions: ['GuildOnly', 'inVoiceChannel', 'isPlaying']
})
export class QueueCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      { idHints: ['1050407482972966982'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const queue = this.container.player.getQueue(interaction.guild!)

    const nowPlaying = queue.nowPlaying()
    const list = queue.tracks.map((track, index) => {
      return {
        name: `${index + 1} Pyytäjä: ${track.requestedBy.username}`,
        value: `[${track.title}](${track.url})`
      }
    })

    const embed = new MessageEmbed()
      .setColor('#c5e463')
      .setURL(nowPlaying.url)
      .setTitle(nowPlaying.title)
      .setAuthor({
        name: `Nyt soi! Pyytäjä: ${nowPlaying.requestedBy.username}`
      })
      .setThumbnail(nowPlaying.thumbnail)
      .addFields(list)

    return await interaction.reply({
      ephemeral: true,
      embeds: [embed]
    })
  }
}
