import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

@ApplyOptions<Command.Options>({
  name: 'changeregion',
  description:
    'Vaihtaa sijaintia. Toimii noin 90% mahdollisuudella. 10% mahdollisuus kääntää maapallo ympäri.',
  preconditions: ['GuildOnly', 'inVoiceChannel']
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description
      },
      { idHints: ['1050407387649015910'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild())
      throw new Error('Friikki ei guildia error (ei pitäs olla mahdollista)')

    await interaction.deferReply()

    const vc = interaction.member.voice.channel!
    const uusiRegion = vc.rtcRegion == 'rotterdam' ? 'russia' : 'rotterdam'
    await vc.setRTCRegion(uusiRegion)

    const componentRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
      new ButtonBuilder()
        .setLabel('Anna mun valita')
        .setCustomId('cr:choice')
        .setEmoji('762312767624708108')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setLabel('Done')
        .setCustomId('cr:removeMessage')
        .setStyle(ButtonStyle.Secondary)
    ])

    return interaction.followUp({
      content: `Kanavan <#${vc.id}> region muutettiin. Uusi region: ${uusiRegion}`,
      components: [componentRow]
    })
  }
}
