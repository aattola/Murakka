import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { EmbedBuilder } from 'discord.js'
import { getElixiaVisitors } from '../lib/elixia'

@ApplyOptions<Command.Options>({
  name: 'elixia',
  description: 'Paljonko porukkaa löytyy elixia salista linnainmaa?'
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      { idHints: ['1077660113638260848'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: false })
    if (!interaction.inCachedGuild()) throw new Error('Rare en tunne guildia error')

    const visitorData = await getElixiaVisitors().catch(() => null)

    if (visitorData === null) return interaction.editReply('Elixia ei vastaa. / Jokin on rikki')

    const embed = new EmbedBuilder()
      .setColor('#639de4')
      .setTitle(`Jopa ${visitorData.payload.currentVisitorLoad.gymTraining} ihmistä!`)
      .setAuthor({
        name: 'Nyt Linnainmaan elixialla liikkuu'
      })

    await interaction.editReply({ embeds: [embed] })
  }
}
