import { ChatInputCommand, Command } from '@sapphire/framework'

export class Tyhmaks extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options })
  }

  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName('tyhmaks').setDescription('tyhmaks made me do it'),
      {
        idHints: ['1050407385904205866']
      }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const player = this.container.player

    if (!interaction.guild) return
    const queue = player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel
      }
    })

    await interaction.deferReply()

    if (!interaction.inCachedGuild()) return

    if (!interaction.member) return
    try {
      if (!queue.connection) await queue.connect(interaction.member.voice.channel!)
    } catch {
      queue.destroy()
      return await interaction.reply({
        content: 'Could not join your voice channel!',
        ephemeral: true
      })
    }

    const track = await player
      .search('tyhmäks turisti', {
        requestedBy: interaction.user
      })
      .then((x) => x.tracks[0])
    if (!track)
      return await interaction.followUp({
        content: `❌ | Track **** not found!`
      })

    await queue.play(track, {
      immediate: true
    })

    await interaction.followUp('kissa')
  }
}
