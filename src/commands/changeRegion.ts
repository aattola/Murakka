import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { MessageActionRow, MessageButton } from 'discord.js'

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
      { idHints: ['1014579689542664364'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    if (!interaction.inCachedGuild())
      throw new Error('Friikki ei guildia error (ei pitäs olla mahdollista)')

    await interaction.deferReply()

    const vc = interaction.member.voice.channel!
    const uusiRegion = vc.rtcRegion == 'rotterdam' ? 'russia' : 'rotterdam'
    await vc.setRTCRegion(uusiRegion)

    const componentRow = new MessageActionRow().addComponents([
      new MessageButton()
        .setLabel('Anna mun valita')
        .setCustomId('cr:choice')
        .setEmoji('762312767624708108')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setLabel('Done')
        .setCustomId('cr:removeMessage')
        .setStyle('SECONDARY')
    ])

    return interaction.followUp({
      content: `Kanavan <#${vc.id}> region muutettiin. Uusi region: ${uusiRegion}`,
      components: [componentRow]
    })
  }
}
