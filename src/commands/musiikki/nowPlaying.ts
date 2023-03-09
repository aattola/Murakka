import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { nytSoiViesti } from '../../player/soittaminen'

@ApplyOptions<Command.Options>({
  name: 'np',
  description: 'Mitä nyt soi?',
  requiredClientPermissions: ['Connect', 'ViewChannel'],
  preconditions: ['GuildOnly', 'inVoiceChannel', 'isPlaying']
})
export class NowPlayingCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      { idHints: ['1050407392338247680'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const queue = this.container.player.nodes.get(interaction.guild!)!

    const nowPlaying = queue.currentTrack
    if (!nowPlaying) return interaction.reply({ content: 'Nyt ei soi mitään', ephemeral: true })

    const embed = nytSoiViesti(nowPlaying)

    return await interaction.reply({
      ephemeral: false,
      embeds: [embed]
    })
  }
}
