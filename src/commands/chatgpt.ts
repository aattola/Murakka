import { ApplyOptions } from '@sapphire/decorators'
import { BucketScope, Command } from '@sapphire/framework'
import { getPrompt } from '../lib/chatgpt'

@ApplyOptions<Command.Options>({
  name: 'chatgpt',
  description: 'Tekoälyä parhaimmillaan',
  cooldownDelay: 20_000,
  cooldownScope: BucketScope.User
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) =>
            option.setName('viesti').setDescription('Mitäs tarinoit botille').setRequired(true)
          ),
      {
        idHints: ['1080616886288527480']
      }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: false })
    if (!interaction.inCachedGuild()) throw new Error('Rare en tunne guildia error')

    const vastaus = await getPrompt(interaction.options.getString('viesti')!)

    await interaction.editReply({
      content: `
        > ${interaction.options.getString('viesti')}\n${vastaus}
      `
    })
  }
}
