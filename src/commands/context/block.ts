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

      { idHints: ['1029107441805299712'] }
    )
  }

  public async contextMenuRun(interaction: Command.ContextMenuInteraction) {
    await block(interaction)
  }
}
