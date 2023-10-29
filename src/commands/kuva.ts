import { ApplyOptions } from '@sapphire/decorators'
import { BucketScope, Command } from '@sapphire/framework'
import { createImage, getPrompt } from '../lib/chatgpt'
import { AttachmentBuilder } from 'discord.js'

@ApplyOptions<Command.Options>({
  name: 'kuva',
  description: 'Tekoälyä parhaimmillaan',
  cooldownDelay: 30_000,
  cooldownScope: BucketScope.User
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) =>
            option
              .setName('teksti')
              .setDescription('Mistä teksti josta kuva generoidaan')
              .setRequired(true)
          ),
      {
        idHints: ['1168230800190357605']
      }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: false })
    if (!interaction.inCachedGuild()) throw new Error('Rare en tunne guildia error')
    const teksti = interaction.options.getString('teksti')!

    const vastaus = await createImage(teksti)

    if (vastaus === undefined) {
      return interaction.editReply({
        content: 'Virhe tapatui kuvaa generoidessa :('
      })
    }
    const kuva = new AttachmentBuilder(vastaus, {
      name: 'AI Generated kuva.png'
    })

    await interaction.editReply({
      content: `> ${teksti}`,
      files: [kuva]
    })
  }
}
