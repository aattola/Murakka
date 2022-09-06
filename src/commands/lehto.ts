import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { request } from 'undici'
import { Time } from '@sapphire/time-utilities'

@ApplyOptions<Command.Options>({
  name: 'lehto',
  description: 'Tällä komennolla jekutetaan lehtoa',
  cooldownDelay: Time.Second * 30
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) =>
            option.setName('viesti').setDescription('Viesti joka lähetetään').setRequired(true)
          ),
      {
        idHints: ['1014947881519693864']
      }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    if (interaction.user.id === '709644495351840779') {
      await interaction.deferReply({ ephemeral: true })

      const viesti = interaction.options.getString('viesti')!

      try {
        const { statusCode } = await request(process.env.SALAINEN_OSOITE + viesti)
        if (statusCode === 200) {
          return await interaction.followUp({
            content: 'Viestin lähetys onnistui'
          })
        }

        return await interaction.followUp({ content: 'Viestin lähetys epäonnistui' })
      } catch (err) {
        console.log(err)
        return await interaction.followUp({ content: 'Viestin lähetys epäonnistui' })
      }
    }

    return interaction.reply('Ei onnistu mene muualle')
  }
}
