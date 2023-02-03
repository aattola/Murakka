import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { Time } from '@sapphire/time-utilities'
import { haeJaSoita } from '../../player/soittaminen'

@ApplyOptions<Command.Options>({
  name: 'soita',
  description: 'Soita musiikkia tästä',
  requiredClientPermissions: ['Connect', 'ViewChannel'],
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
      { idHints: ['1050407481647566869'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true })

    let hakusana = interaction.options.getString('hakusana')!
    if (hakusana?.startsWith('JFFe___________')) {
      // hei täähän on autofill id:llä
      const id = hakusana.split('___________')[1]!
      hakusana = `https://www.youtube.com/watch?v=${id}`
    }

    await haeJaSoita(interaction, hakusana)
  }
}
