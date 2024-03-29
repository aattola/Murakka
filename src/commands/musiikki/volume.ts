import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'

@ApplyOptions<Command.Options>({
  name: 'volume',
  description: 'Mitä? Voluumia vaihdellaan? 5-200',
  requiredClientPermissions: ['Connect', 'ViewChannel'],
  preconditions: ['GuildOnly', 'inVoiceChannel', 'isPlaying']
})
export class VolumeCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addIntegerOption((option) =>
            option
              .setName('voluumi')
              .setDescription('Mitä äänenvoimakkuutta laitetaan')
              .setRequired(true)
              .setMinValue(5)
              .setMaxValue(200)
          ),
      { idHints: ['1050407569035903066'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const queue = this.container.player.nodes.get(interaction.guild!)!
    const volume = interaction.options.getInteger('voluumi')!

    queue.node.setVolume(volume)

    return await interaction.reply({
      content: 'Asetin voluumin numeroon ' + volume,
      ephemeral: true
    })
  }
}
