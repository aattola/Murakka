import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { EmbedBuilder } from 'discord.js'

@ApplyOptions<Command.Options>({
  name: 'queue',
  description: 'Mitä jonossa on?',
  requiredClientPermissions: ['Connect', 'ViewChannel'],
  preconditions: ['GuildOnly', 'inVoiceChannel', 'isPlaying']
})
export class QueueCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      { idHints: ['1050407482972966982'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const queue = this.container.player.nodes.get(interaction.guild!)!

    const nowPlaying = queue.currentTrack
    if (!nowPlaying) return interaction.reply({ content: 'Nyt ei soi mitään', ephemeral: true })

    const list = queue.tracks.map((track, index) => {
      return {
        name: `${index + 1} Pyytäjä: ${track.requestedBy?.username}`,
        value: `[${track.title}](${track.url})`
      }
    })

    const embed = new EmbedBuilder()
      .setColor('#c5e463')
      .setURL(nowPlaying.url)
      .setTitle(nowPlaying.title)
      .setAuthor({
        name: `Nyt soi! Pyytäjä: ${nowPlaying.requestedBy?.username}`
      })
      .setThumbnail(nowPlaying.thumbnail)
      .addFields(list)

    return await interaction.reply({
      ephemeral: true,
      embeds: [embed]
    })
  }
}
