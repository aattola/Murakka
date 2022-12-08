import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'

@ApplyOptions<Command.Options>({
  description: 'On aika murakka komento'
})
class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerContextMenuCommand(
      {
        name: this.name,
        type: 'MESSAGE'
      },
      { idHints: ['1050407663818776577'] }
    )
  }

  public async contextMenuRun(interaction: Command.ContextMenuInteraction) {
    return await interaction.reply({ content: 'moikku miten menee!' })
  }
}

export { UserCommand }
