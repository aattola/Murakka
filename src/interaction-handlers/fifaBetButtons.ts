import {
  container,
  InteractionHandler,
  InteractionHandlerTypes,
  PieceContext
} from '@sapphire/framework'
import type { ButtonInteraction } from 'discord.js'

export class FifaBetButtons extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button
    })
  }
  public override parse(interaction: ButtonInteraction) {
    if (interaction.customId.startsWith('gamba:')) return this.some()
    return this.none()
  }

  public async run(interaction: ButtonInteraction) {
    if (!interaction.inCachedGuild())
      throw new Error('Friikki ei guildia error (ei pitäs olla mahdollista)')

    if (interaction.customId.startsWith('gamba:bet')) {
      const [, , gameId, teamId] = interaction.customId.split(':')

      const res = await container.prisma.gamba.findMany({
        where: {
          gambaajanId: interaction.member.id,
          peliId: gameId
        }
      })

      if (res.length !== 0)
        return interaction.reply({
          ephemeral: true,
          content: 'Olet betannut jo. Mene kotiis'
        })

      const bet = await container.prisma.gamba.create({
        data: {
          tiimiId: teamId,
          peliId: gameId,
          gambaajanId: interaction.member.id,
          timestamp: new Date(),
          betti: 100,
          gambaajanname: interaction.member.user.username,
          peliNimi: 'laiska kloppi unohti tän tekstin',
          tiimiNimi: 'tämä myös unohtui',
          viestinId: interaction.message.id
        }
      })

      if (bet.id) {
        await interaction.reply({
          ephemeral: true,
          content: `Onnistui tämä bettaus`
        })
      } else {
        await interaction.reply({
          ephemeral: true,
          content: `Ei bettaus onnistunut syystä x, y, z`
        })
      }
    }
  }
}
