import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework'
import { ActionRowBuilder, ButtonInteraction, Message, StringSelectMenuBuilder } from 'discord.js'

export class GettistaButtons extends InteractionHandler {
  public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button
    })
  }
  public override parse(interaction: ButtonInteraction) {
    if (interaction.customId.startsWith('gettista:')) return this.some()
    return this.none()
  }

  public async run(interaction: ButtonInteraction) {
    if (interaction.customId === 'gettista:palautetta') {
      const message = <Message>interaction.message
      if (message.content.toLowerCase().includes(interaction.user.username.toLowerCase())) {
        return interaction.reply({
          ephemeral: true,
          content: 'Annoit palautteesi jo. Et kai yritä spämmiä tai mitään. (komppaus tai palaute)'
        })
      }

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`gettista_select:${interaction.message.id}`)
          .setPlaceholder('Valitse palaute sitten')
          .addOptions([
            {
              label: 'Olet homo',
              description: 'homo homo homo homo homo homo homo homo homo',
              value: 'homo',
              emoji: '872819082339155978'
            },
            {
              label: 'Olet vammainen',
              description: 'KeVa jne',
              value: 'vammainen',
              emoji: '667742302789304330'
            },
            {
              label: 'Olet ihonvärin perusteella vähemmistöön kuuluva',
              description: 'Niih tällee ja tollee',
              value: 'rasismi',
              emoji: '872864077842616330'
            }
          ])
      )

      await interaction.reply({
        content: 'Anna palautetta sitten:',
        components: [row],
        ephemeral: true
      })

      return
    }

    if (interaction.customId === 'gettista:komppaan') {
      await interaction.deferReply({ ephemeral: true })

      const message = <Message>interaction.message
      if (message.content.toLowerCase().includes(interaction.user.username.toLowerCase())) {
        return interaction.reply({
          ephemeral: true,
          content: 'ET TROLLAA tolleen nyt pliis (spämmi nimeäs viestiin luuseri)'
        })
      }

      await interaction.update({
        content: `${message.content}\n${interaction.user.username} +1\n`
      })
      return
    }
  }
}
