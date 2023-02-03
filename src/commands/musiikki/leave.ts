import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'

@ApplyOptions<Command.Options>({
  name: 'leave',
  description: 'Lähde nyt äkkiä pois kanavasta',
  requiredClientPermissions: ['Connect', 'ViewChannel'],
  preconditions: ['GuildOnly', 'inVoiceChannel', 'isPlaying']
})
export class LeaveCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description
      },
      { idHints: ['1050407485376319600'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const queue = this.container.player.getQueue(interaction.guild!)

    queue.clear()
    queue.destroy(true)

    return await interaction.reply({
      content: 'Lähdin pois kanavasta nopeasti ja tehokkaasti.',
      ephemeral: true
    })
  }
}
