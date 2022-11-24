import * as Ably from 'ably/promises'
import { container } from '@sapphire/framework'
import { z } from 'zod'
import formatDistance from 'date-fns/formatDistance'
import { fi } from 'date-fns/locale'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'

const FIFA_KANAVA = '1045011711796719677'

const ably = new Ably.Realtime({
  key: process.env.ABLY_KEY!,
  autoConnect: true
})

ably.connection.on('disconnected', (connectionStateChange) => {
  container.logger.info('Ably::connection: Disconnected')
  if (connectionStateChange.reason?.code === 80002) return ably.connect()
  if (!connectionStateChange.retryIn) return ably.connect()
})

const createFifaMessage = (title: string, text: string): MessageEmbed =>
  new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle(title)
    .setURL('https://areena.yle.fi/tv/suorat/yle-tv2')
    .setDescription(text)

const alkaaShape = z
  .object({
    id: z.string(),
    timestamp: z.number(),
    voteEnds: z.number(),
    home: z.string(),
    away: z.string(),
    homeId: z.string(),
    awayId: z.string()
  })
  .passthrough()

const loppuShape = z
  .object({
    id: z.string(),
    home: z.string(),
    away: z.string(),
    homeId: z.string(),
    awayId: z.string(),
    homeScore: z.number(),
    awayScore: z.number()
  })
  .passthrough()
async function initFifa() {
  const channel = ably.channels.get('peliAlkaa')
  const overChannel = ably.channels.get('peliOhi')
  const kanava = await container.client.channels.fetch(FIFA_KANAVA)
  if (!kanava) throw new Error('Fifa kanavaa ei löytynyt!')
  if (!kanava.isText()) throw new Error('Kanava ei ole tekstillinen')

  await overChannel
    .subscribe(async (message) => {
      const parse = loppuShape.safeParse(message.data)
      if (!parse.success) return console.log('Jokin puuttuu', parse.error)

      const value =
        parse.data.homeScore === parse.data.awayScore
          ? `Tasapeli kukaan bozo ei voita mitään. Vaan saa rahat takaisin`
          : `\n${parse.data.homeScore} - ${parse.data.awayScore}. Voittoja lasketaan ja tilitetään.`

      const embed = new MessageEmbed()
        .setColor(0x0099ff)
        .setTitle('Peli loppui!')
        .setURL('https://areena.yle.fi/tv/suorat/yle-tv2')
        .setDescription(`${parse.data.home} vastaan ${parse.data.away} ${value}`)

      await kanava.send({ embeds: [embed] })
      await laskeVoitot(parse.data)
    })
    .then(() => container.logger.info('Ably::peliOhi: Yhdistetty'))

  await channel
    .subscribe(async (message) => {
      const parse = alkaaShape.safeParse(message.data)
      if (!parse.success) return console.log('Jokin puuttuu', parse.error)

      const aika = formatDistance(parse.data.timestamp, parse.data.voteEnds, { locale: fi })

      const embed = new MessageEmbed()
        .setColor(0x0099ff)
        .setTitle('Uusi peli alkaa!')
        .setURL('https://areena.yle.fi/tv/suorat/yle-tv2')
        .setDescription(`${parse.data.home} vastaan ${parse.data.away}. Bettaamiseen aikaa ${aika}`)

      const componentRow = new MessageActionRow().addComponents([
        new MessageButton()
          .setLabel(`${parse.data.home} voittaa`)
          .setCustomId(`gamba:bet:${parse.data.id}:${parse.data.homeId}:${parse.data.timestamp}`)
          .setEmoji('975838734954143814')
          .setStyle('SECONDARY'),
        new MessageButton()
          .setLabel(`${parse.data.away} voittaa`)
          .setCustomId(`gamba:bet:${parse.data.id}:${parse.data.awayId}:${parse.data.timestamp}`)
          .setEmoji('934146890344333422')
          .setStyle('SECONDARY')
      ])

      await kanava.send({ embeds: [embed], components: [componentRow] })
    })
    .then(() => container.logger.info('Ably::peliAlkaa: Yhdistetty'))
}

async function laskeVoitot(data: z.infer<typeof loppuShape>) {
  let voittaja
  if (data.homeScore === data.awayScore) {
    voittaja = 'tasapeli'
  }

  if (data.homeScore > data.awayScore) {
    voittaja = 'home'
  } else {
    voittaja = 'away'
  }

  const game = await container.prisma.gamba.findFirst({
    where: {
      peliId: data.id
    }
  })
  if (!game) return container.logger.info('kukaan ei gambannut')

  const tiimiId = voittaja === 'home' ? data.homeId : data.awayId

  if (voittaja === 'tasapeli') return container.logger.warn('ei voittajia! tasapeli')

  const res = await container.prisma.gamba.findMany({
    where: {
      peliId: data.id,
      tiimiId: tiimiId
    }
  })

  const kanava = await container.client.channels.fetch(FIFA_KANAVA)
  if (kanava?.isText()) {
    const msg = await kanava.messages.fetch(game.viestinId)
    const voittajat = res.map((voittaja) => `${voittaja.gambaajanname}\n`)
    const embed = createFifaMessage(`${game.peliNimi} Peli ohi`, `Voittajat:\n ${voittajat}`)
    await msg.edit({ embeds: [embed], components: [] })
  }

  if (res.length === 0) return console.log('Kukaan ei voittanut :(')

  // voittajia

  for (const voittaja1 of res) {
    const tilanne = await container.prisma.rahatilanne.findFirst({
      where: {
        userId: voittaja1.gambaajanId
      },
      orderBy: {
        timestamp: 'desc'
      }
    })
    const user = await container.client.users.fetch(voittaja1.gambaajanId)

    if (!tilanne) {
      const eId = container.sentry.captureMessage(
        `Hemmolla ${voittaja1.gambaajanId} ei ole rahaa??`
      )
      return await user.send(`Virhe tapahtui tilityksessä laita leeville koodi: ${eId}`)
    }

    const nykytilanne = await container.prisma.rahatilanne.create({
      data: {
        userName: voittaja1.gambaajanname,
        userId: voittaja1.gambaajanId,
        rahat: tilanne.rahat + 200
      }
    })

    await user.send(
      `Hei sää tuplasit 100€ eli pitkällä matikalla laskettuna sait 200€. Sinulla on nyt ${nykytilanne.rahat}`
    )
  }
}

export { initFifa }
