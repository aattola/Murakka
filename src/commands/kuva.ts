import { ApplyOptions } from '@sapphire/decorators'
import { BucketScope, Command } from '@sapphire/framework'
import { createImage } from '../lib/chatgpt'
import { AttachmentBuilder } from 'discord.js'
import { fetch } from 'undici'
import { RecordType } from 'zod'

interface txt2imgRes {
  images: string[]
  parameters: RecordType<any, any>
  info: string
}

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

  private async fetchImage(prompt: string) {
    const res = await fetch('https://ai.jeffe.co/sdapi/v1/txt2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt
      })
    })

    if (res.status === 422) throw new Error('Hei joku meni mönkään (validation error)')

    const data = (await res.json()) as txt2imgRes

    return data.images[0]
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: false })
    if (!interaction.inCachedGuild()) throw new Error('Rare en tunne guildia error')
    const teksti = interaction.options.getString('teksti')!

    // const vastaus = await createImage(teksti)
    const vastaus = await this.fetchImage(teksti).catch(async () => {
      return {
        fallback: true,
        image: await createImage(teksti)
      }
    })

    if (vastaus === undefined) {
      return interaction.editReply({
        content: 'Virhe tapatui kuvaa generoidessa :('
      })
    }

    let kuva
    let isFallback = false

    if (typeof vastaus === 'object') {
      isFallback = true
      kuva = new AttachmentBuilder(vastaus.image!, {
        name: 'AI Generated kuva.png'
      })
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const buf = new Buffer.from(vastaus, 'base64')
      kuva = new AttachmentBuilder(buf, {
        name: isFallback ? 'AI Generated kuva.png' : 'SPOILER_AIkuva.png'
      })
    }

    await interaction.editReply({
      content: `> ${teksti} ${isFallback ? '(OpenAI Generoima)' : ''}`,
      files: [kuva]
    })
  }
}
