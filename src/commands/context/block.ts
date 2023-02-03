import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { ApplicationCommandType } from 'discord-api-types/v10'
import { block } from '../../lib/block'

@ApplyOptions<Command.Options>({
  name: 'Lisää blokkilistalle',
  description: 'Lisää blokkilistalle'
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerContextMenuCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setType(ApplicationCommandType.Message),

      { idHints: ['1050407389339320370'] }
    )
  }

  public async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
    await block(interaction)
  }
}
