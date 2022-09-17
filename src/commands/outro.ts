import { ApplyOptions } from '@sapphire/decorators'
import { Command, container } from '@sapphire/framework'
import { Time } from '@sapphire/time-utilities'
import playdl from 'play-dl'
import { QueryType } from 'discord-player'

@ApplyOptions<Command.Options>({
  name: 'outro',
  description: 'Lähde pois puhelusta tyylillä.',
  requiredClientPermissions: ['MOVE_MEMBERS'],
  preconditions: ['GuildOnly'],
  cooldownDelay: Time.Second * 25,
  cooldownFilteredUsers: ['214760917810937856']
})
export class OutroCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addUserOption((option) =>
          option.setName('ihminen').setDescription('Kenelle outro tehdään').setRequired(false)
        )
    ),
      { idHints: ['1020749125651812353'] }
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const { player } = container
    await interaction.deferReply({ ephemeral: true })

    if (!interaction.inCachedGuild())
      throw new Error('Friikki ei guildia error (ei pitäs olla mahdollista)')

    if (player.getQueue(interaction.guildId))
      return interaction.editReply({
        content: 'Outroa ei voi suorittaa kun muuta musiikkia soi.'
      })

    let ihminen = interaction.options.getMember('ihminen')
    if (!ihminen) {
      ihminen = interaction.member
    }

    if (!ihminen.voice.channel)
      return interaction.editReply({
        content: `${ihminen.user.username} ei ole puhelussa!`
      })

    const queue = player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel,
        silent: true
      },
      leaveOnEmpty: true,
      leaveOnEnd: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      async onBeforeCreateStream(track, source) {
        if (source === 'youtube') {
          return (await playdl.stream(track.url, { discordPlayerCompatibility: true })).stream
        }
      }
    })

    try {
      if (!queue.connection) await queue.connect(interaction.member.voice.channel!)
    } catch {
      queue.destroy()
      return await interaction.followUp({
        content: 'Hei ukko en pystynyt liittymään kanavaan',
        ephemeral: true
      })
    }

    const track = await player
      .search('https://www.youtube.com/watch?v=FX9eEhoRZhY', {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO
      })
      .then((x) => x.tracks[0])

    queue.setVolume(35)
    await queue.play(track, {
      immediate: true
    })

    await interaction.editReply({
      content: 'Outroa suoritetaan'
    })

    player.once('trackStart', (j) => {
      if (j.id !== queue.id) return

      setTimeout(() => {
        void ihminen?.voice.disconnect()
        setTimeout(() => {
          queue.destroy(true)
        }, 12000)
      }, 15000)
    })
  }
}
