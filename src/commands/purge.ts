import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'

@ApplyOptions<Command.Options>({
  name: 'purge',
  description: 'Tuskin sinulla on oikeuksia tähän joten älä edes yritä',
  preconditions: ['GuildOnly', 'isOwner'],
  requiredClientPermissions: ['VIEW_CHANNEL', 'MANAGE_MESSAGES']
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addIntegerOption((option) =>
            option
              .setName('numero')
              .setDescription('Montako poistetaan')
              .setRequired(true)
              .setMaxValue(50)
              .setMinValue(2)
          ),
      {
        idHints: ['1050407390744428605']
      }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    await interaction.deferReply({ ephemeral: true })
    if (!interaction.inCachedGuild()) throw new Error('Rare en tunne guildia error')

    const montako = interaction.options.getInteger('numero')!
    const channel = interaction.channel!

    const ok = await channel.bulkDelete(montako)
    if (ok) {
      return await interaction.followUp({
        content: `<a:ModTime:770795659552096307> Poistettiin ${montako} viestiä.`
      })
    }
  }
}
