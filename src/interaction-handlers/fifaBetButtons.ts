import {
  container,
  InteractionHandler,
  InteractionHandlerTypes,
  PieceContext
} from '@sapphire/framework'
import type { ButtonInteraction } from 'discord.js'
import { fetch } from 'undici'
import { addHours, differenceInSeconds } from 'date-fns'

async function fetchGame(id: string) {
  const res = await fetch(`https://fifa.jeffe.co/peli/${id}`)
  return await res.json()
}

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
      await interaction.deferReply({ ephemeral: true })

      const [, , gameId, teamId, timestamp] = interaction.customId.split(':')

      const stopTime = addHours(new Date(+timestamp * 1000), 0)

      const eroSekunneissa = differenceInSeconds(new Date(), stopTime)
      // logger.info('ero', {
      //   stopTime,
      //   date: new Date(+timestamp * 1000),
      //   eroSekunneissa,
      //   currd: new Date()
      // })

      if (eroSekunneissa > 1800) {
        await interaction.editReply({
          content: 'Et ehtinyt äänestämään 30 minuutin sisään viestin lähetyksestä.'
        })
        return
      }

      const res = await container.prisma.gamba.findMany({
        where: {
          gambaajanId: interaction.member.id,
          peliId: gameId
        }
      })

      if (res.length !== 0)
        return interaction.editReply({
          content: 'Olet betannut jo. Mene kotiis'
        })

      const peli = (await fetchGame(gameId)) as {
        HomeTeam: { ShortClubName: string; IdTeam: string }
        AwayTeam: { ShortClubName: string; IdTeam: string }
      }

      const bet = await container.prisma.gamba.create({
        data: {
          tiimiId: teamId,
          peliId: gameId,
          gambaajanId: interaction.member.id,
          timestamp: new Date(),
          betti: 100,
          gambaajanname: interaction.member.user.username,
          peliNimi: `${peli?.HomeTeam?.ShortClubName} vs ${peli?.AwayTeam?.ShortClubName}`,
          tiimiNimi:
            peli.HomeTeam.IdTeam === teamId
              ? peli.HomeTeam.ShortClubName
              : peli.AwayTeam.ShortClubName,
          viestinId: interaction.message.id
        }
      })

      const tilanne = await container.prisma.rahatilanne.findFirst({
        where: {
          userId: interaction.user.id
        },
        orderBy: {
          timestamp: 'desc'
        }
      })

      if (tilanne && tilanne.rahat < 100) {
        return interaction.editReply({
          content: 'Sinulla ei ole rahaa tämmöiseen liikeeseen'
        })
      }

      const nykytilanne = await container.prisma.rahatilanne.create({
        data: {
          userId: interaction.user.id,
          userName: interaction.user.username,
          rahat: tilanne ? tilanne.rahat - 100 : 400
        }
      })

      if (bet.id) {
        await interaction.editReply({
          content: `Onnistui tämä bettaus. Sinulla on nyt ${nykytilanne.rahat}€`
        })
      } else {
        await interaction.editReply({
          content: `Ei bettaus onnistunut syystä x, y, z`
        })
      }
    }
  }
}
