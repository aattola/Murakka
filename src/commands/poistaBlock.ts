import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { fetchBlocklist, removeBlock } from '../lib/block'

@ApplyOptions<Command.Options>({
  name: 'poistablock',
  description: 'Poista block hashilla'
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) => {
            return option.setName('input').setDescription('Hash (md5) / url').setRequired(true)
          })
          .addBooleanOption((option) => {
            return option.setName('md5').setDescription('Haetaanko md5').setRequired(true)
          }),
      { idHints: ['1050407666486354021'] }
    )
  }

  public override async chatInputRun(interaction: Command.ChatInputInteraction) {
    await interaction.deferReply()
    const input = interaction.options.getString('input')!
    const md5 = interaction.options.getBoolean('md5')!

    try {
      const res = await removeBlock(input, md5, interaction.user.id)
      await fetchBlocklist()

      await interaction.editReply({ content: `Muokattu ${res} riviä` })
    } catch (e) {
      await interaction.editReply({
        content: `Virhe ${e} muokatessa rivejä argumenteillä ${input} ${md5}`
      })
    }
  }
}
