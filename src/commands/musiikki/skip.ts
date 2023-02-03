import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'

@ApplyOptions<Command.Options>({
  name: 'skip',
  description: 'Ohita tämä roska biisi nyt äkkiä',
  requiredClientPermissions: ['Connect', 'ViewChannel'],
  preconditions: ['GuildOnly', 'inVoiceChannel', 'isPlaying']
})
export class SkipCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description
      },
      { idHints: ['1050407484348710952'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const queue = this.container.player.getQueue(interaction.guild!)

    queue.skip()

    return await interaction.reply({
      content: 'Skippasin videon nopeasti ja tehokkaasti.',
      ephemeral: true
    })
  }
}
