import { ApplyOptions } from '@sapphire/decorators'
import { Command, container } from '@sapphire/framework'

@ApplyOptions<Command.Options>({
  name: 'asetukset',
  description: 'Aseta globaaleja redis kv asetuksia',
  preconditions: ['isOwner']
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) => {
            return option.setName('key').setDescription('key').setRequired(true)
          })
          .addStringOption((option) => {
            return option.setName('val').setDescription('val').setRequired(true)
          }),
      { idHints: ['1029137701036884069'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    await interaction.deferReply({ ephemeral: true })
    if (!interaction.inCachedGuild()) throw new Error('Rare en tunne guildia error')

    const key = interaction.options.getString('key')!
    const val = interaction.options.getString('val')!

    const ok = await container.keyv.set(key, val)
    if (ok) {
      return await interaction.editReply({
        content: `Asetettu ${key}:${val}`
      })
    }
  }
}
