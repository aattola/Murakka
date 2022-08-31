import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'

@ApplyOptions<Command.Options>({
  name: 'leave',
  description: 'Lähde nyt äkkiä pois kanavasta',
  requiredClientPermissions: ['CONNECT', 'VIEW_CHANNEL'],
  preconditions: ['GuildOnly', 'inVoiceChannel', 'isPlaying']
})
export class LeaveCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description
      },
      { idHints: ['1014560347266482326'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const queue = this.container.player.getQueue(interaction.guild!)

    queue.clear()
    queue.destroy(true)

    return await interaction.reply({
      content: 'Lähdin pois kanavasta nopeasti ja tehokkaasti.',
      ephemeral: true
    })
  }
}
