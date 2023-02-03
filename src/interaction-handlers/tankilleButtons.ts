import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework'
import type { ButtonInteraction, EmbedField } from 'discord.js'
import { tankille } from '../init/tankille'
import { EmbedBuilder } from 'discord.js'

export class TankilleButtons extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button
    })
  }
  public override parse(interaction: ButtonInteraction) {
    if (interaction.customId.startsWith('tankille:')) return this.some()
    return this.none()
  }

  public async run(interaction: ButtonInteraction) {
    if (interaction.customId === 'tankille:listGas') {
      await interaction.deferReply({ ephemeral: true })

      const bensa = await tankille.getStationsByLocation(
        {
          lat: 61.492,
          lon: 23.993
        },
        15000
      )

      const stationitJossaOn95 = bensa.filter((asema) => {
        return asema.fuels.includes('95')
      })

      const sorted = stationitJossaOn95.sort((a, b) => {
        if (a.price.length === 0) return 0
        if (b.price.length === 0) return 0

        const aPrice = a.price.find((a) => a.tag === '95')
          ? a.price.find((a) => a.tag === '95')!.price
          : 0
        const bPrice = a.price.find((a) => a.tag === '95')
          ? b.price.find((a) => a.tag === '95')!.price
          : 0

        return aPrice - bPrice
      })

      const lista = sorted.map((asema) => {
        const ysiviisHinta = asema.price.filter((fuel) => fuel.tag === '95')[0]
        const dieselHinta = asema.price.filter((fuel) => fuel.tag === 'dsl')[0]

        const oneAsema: EmbedField = {
          name: asema.name,
          value: `95: ${ysiviisHinta ? ysiviisHinta.price : 'Ei löytynyt'} Diesel: ${
            dieselHinta ? dieselHinta.price : 'Ei löytynyt'
          }`,
          inline: false
        }

        return oneAsema
      })

      const lista25 = lista.slice(0, 25)

      const embed = new EmbedBuilder()
        .setTitle('Tankille')
        .setDescription(
          'Tuossa näkyy 95 ja kiisselin hinnat. Listana tälläkertaa. Lajiteltu 95 hinnan perusteella halvimmasta kalleimpaan. Vain 25 halvinta listattu koska discord ei salli enempää. :)'
        )
        .addFields(lista25)
        .setTimestamp(new Date())
        .setFooter({ text: 'Tankkausbotti' })

      await interaction.editReply({
        embeds: [embed]
      })
    }
  }
}
