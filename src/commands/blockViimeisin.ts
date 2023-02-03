import { ApplyOptions } from '@sapphire/decorators'
import { Command, container } from '@sapphire/framework'
import { rawBlock } from '../lib/block'

@ApplyOptions<Command.Options>({
  name: 'blockviimeisin',
  description: 'Blokkaa viimeisin postaus tältä trollilta'
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .addUserOption((option) => {
            return option
              .setName('kenelta')
              .setDescription('Keneltä estetään tuo äskeinen roskapostaus')
              .setRequired(true)
          }),
      { idHints: ['1050398850331971636'] }
    )
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const user = interaction.options.getUser('kenelta', true)!
    const viesti: string | undefined = await container.keyv.get(`lastMessage:${user.id}`)

    if (!viesti) return interaction.reply({ content: 'Viestihistoriaa ei löytynyt!' })

    await interaction.reply({
      ephemeral: true,
      content: 'Estetään'
    })
    rawBlock(viesti, user.id, user.username, interaction.user.username, interaction.user.id)
  }
}
