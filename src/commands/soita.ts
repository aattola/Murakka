import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { Time } from '@sapphire/time-utilities'

@ApplyOptions<Command.Options>({
  name: 'soita',
  description: 'Soita musiikkia tästä',
  requiredClientPermissions: ['CONNECT', 'VIEW_CHANNEL'],
  preconditions: ['GuildOnly', 'inVoiceChannel'],
  cooldownDelay: Time.Second * 5,
  cooldownFilteredUsers: ['214760917810937856']
})
export class SoitaCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) =>
            option
              .setName('hakusana')
              .setDescription('Mitä haetaan')
              .setRequired(true)
              .setAutocomplete(true)
          ),
      { idHints: ['1014509195216818266'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    await interaction.deferReply()

    let hakusana = interaction.options.getString('hakusana')!
    if (hakusana?.startsWith('JFFe___________')) {
      // hei täähän on autofill id:llä
      const id = hakusana.split('___________')[1]!
      hakusana = `https://www.youtube.com/watch?v=${id}`
    }

    if (!interaction.inCachedGuild())
      throw new Error('Friikki ei guildia error (ei pitäs olla mahdollista)')
    const { player } = this.container

    const queue = player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel
      }
    })

    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel!)
    } catch {
      queue.destroy()
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

    await queue.play(track)

    return await interaction.followUp({
      content: `Ladataan ${track.title}`,
      ephemeral: true
    })
  }
}
