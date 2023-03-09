import { CommandInteraction, GuildTextBasedChannel, EmbedBuilder } from 'discord.js'
import { container } from '@sapphire/framework'
import { Player, Track } from 'discord-player'

function nytSoiViesti(nowPlaying: Track): EmbedBuilder {
  return new EmbedBuilder()
    .setColor('#c5e463')
    .setURL(nowPlaying.url)
    .setTitle(nowPlaying.title)
    .setAuthor({
      name: `Nyt soi! Pyytäjä: ${nowPlaying.requestedBy?.username}`
    })
    .setThumbnail(nowPlaying.thumbnail)
}

function parseYoutubeUrl(url: string): string | false {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7].length == 11 ? match[7] : false
}

function initSoittaminen(player: Player) {
  player.events.on('playerStart', (queue, track) => {
    const metadata = queue.metadata as { channel: GuildTextBasedChannel; silent?: boolean }

    if (metadata.silent) return

    const embed = nytSoiViesti(track)
    void metadata.channel.send({ embeds: [embed] })

    const id = parseYoutubeUrl(track.url)
    void container.keyv.set(`${metadata.channel.guildId}:lastPlayed`, id)
  })

  player.events.on('playerError', (queue, error) => {
    const metadata = queue.metadata as { channel: GuildTextBasedChannel }

    void metadata.channel.send(
      `Virhe tapahtui musiikkia soitettaessa: ${error.message}. Siirryn automaattisesti seuraavaan videoon.`
    )
    queue.node.skip()
  })

  player.events.on('error', (queue, error) => {
    container.logger.error(`[DiscordPlayer] Error`, error, queue.guild.id)
  })
}

async function haeJaSoita(interaction: CommandInteraction, hakusana: string) {
  if (!interaction.inCachedGuild())
    throw new Error('Friikki ei guildia error (ei pitäs olla mahdollista)')
  const { player } = container

  const queue = player.nodes.create(interaction.guild, {
    metadata: {
      channel: interaction.channel
    },
    leaveOnEmpty: true,
    leaveOnEnd: true,
    leaveOnStop: true,
    leaveOnEmptyCooldown: 5000,
    leaveOnEndCooldown: 1000,
    selfDeaf: true,
    volume: 20
    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // // @ts-ignore
    // async onBeforeCreateStream(track, source) {
    //   if (source === 'youtube') {
    //     return (await playdl.stream(track.url, { discordPlayerCompatibility: true })).stream
    //   }
    // }
  })

  try {
    if (!queue.connection) await queue.connect(interaction.member.voice.channel!)
  } catch {
    queue.delete()
    return await interaction.followUp({
      content: 'Hei ukko en pystynyt liittymään kanavallesi',
      ephemeral: true
    })
  }

  const track = await player
    .search(hakusana, {
      requestedBy: interaction.user
    })
    .then((x) => x.tracks[0])

  if (!track)
    return await interaction.followUp({
      content: `Hei ei löytynyt mitään hakusanalla ${hakusana}`,
      ephemeral: true
    })

  await queue.node.play(track)

  return await interaction.followUp({
    content: `Ladataan ${track.title}`,
    ephemeral: true
  })
}

export { haeJaSoita, initSoittaminen, parseYoutubeUrl, nytSoiViesti }
