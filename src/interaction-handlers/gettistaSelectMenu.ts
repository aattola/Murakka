import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework'
import type { SelectMenuInteraction } from 'discord.js'

export class ChangeRegionSelectMenuHandler extends InteractionHandler {
  public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.SelectMenu
    })
  }
  public override parse(interaction: SelectMenuInteraction) {
    if (interaction.customId.startsWith('gettista_select:')) return this.some()
    return this.none()
  }

  public async run(interaction: SelectMenuInteraction) {
    if (!interaction.inCachedGuild())
      throw new Error('Friikki ei guildia error (ei pitäs olla mahdollista)')

    if (interaction.customId.startsWith('gettista_select:')) {
      const msgId = interaction.customId.split('__')[1]
      const message = await interaction.channel?.messages.fetch(msgId)
      if (!message) {
        await interaction.update({
          content:
            'Joku meni päin persettä viestiä haettaessa. Moderoiko jerry sen pois? Vai onko leevi paska koodaan?',
          components: []
        })
        return
      }

      const valinta = interaction.values[0]

      let viesti = ''

      if (valinta === 'homo') {
        viesti = `${interaction.user.username} toteaa julkisesti olevansa homo`
      }

      if (valinta === 'vammainen') {
        viesti = `${interaction.user.username} toteaa olevansa 100% kehitysvammainen. Kysy lisätietoja häneltä!`
      }

      if (valinta === 'rasismi') {
        viesti = `${interaction.user.username} haluaa kaikkien tietävän että hän on ihan umpirasisti!`
      }

      if (message.content.toLowerCase().includes(interaction.user.username.toLowerCase())) {
        return interaction.update({
          content: 'ET TROLLAA tolleen nyt spämmimäl pliis',
          components: []
        })
      }

      await message.edit({
        content: `${message.content}\n${viesti}\n`
      })

      await interaction.update({
        content:
          'Palautteesi on vastaanotettu! Palautteesi on tärkeää jotta voimme parantaa Wiskarin palveluita.',
        components: []
      })

      return
    }
  }
}
