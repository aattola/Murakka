import { ApplyOptions } from '@sapphire/decorators'
import { Command, container } from '@sapphire/framework'
import { formatDistanceToNow } from 'date-fns'
import { fi } from 'date-fns/locale'

@ApplyOptions<Command.Options>({
  name: 'tili',
  description: 'Paljonko tilillä on vbux'
})
export class TiliCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description),
      { idHints: ['1050407583300730901'] }
    )
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ): Promise<any> {
    await interaction.deferReply({ ephemeral: false })

    const tili = await container.prisma.rahatilanne.findMany({
      where: {
        userId: interaction.user.id
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 5
    })

    if (tili.length === 0) return interaction.editReply({ content: 'Eihän sulla edes ole tiliä.' })

    const tiliFormatted = tili
      .map((row) => {
        const date = formatDistanceToNow(new Date(row.timestamp), { locale: fi })
        return `${date} sitten: ${row.rahat}€`
      })
      .join(`\n`)

    await interaction.editReply({
      content: `<@${interaction.user.id}> tili:\n${tiliFormatted}`
    })
  }
}
