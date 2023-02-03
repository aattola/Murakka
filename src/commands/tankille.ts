import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import type { Asema } from '@jeffe/tankille/build/main/types/client'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { tankille } from '../init/tankille'

@ApplyOptions<Command.Options>({
  name: 'tankille',
  description: 'Tampereen lähialueen bensa-asemien hintoja'
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => builder.setName(this.name).setDescription(this.description),
      { idHints: ['1052326184857378836'] }
    )
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: false })

    const data = await tankille.getStationsByLocation(
      {
        lat: 61.492,
        lon: 23.993
      },
      15000
    )

    if (!data) throw new Error('Ei saatu bensadataa')

    // SIIS TÄMÄ ON YKSI "TOIMIIPA AINAKIN" KOODIPÄTKÄ

    const kiisselit = data.filter((value) => {
      if (!value.price[0]) return false
      // klopit ei laita diisselin hintoja vaikka kiisselin hinta löytyisi
      const diisselihinta = value.price.filter((a) => a.tag === 'dsl')
      if (!diisselihinta[0]) return false
      return value.fuels.includes('dsl')
    })

    const ysiviis = data.filter((value) => {
      if (!value.price[0]) return false
      // sama bensalle
      const bensahinta = value.price.filter((a) => a.tag === '95')
      if (!bensahinta[0]) return false
      return value.fuels.includes('95')
    })

    const ysiviitoset = ysiviis.sort((a, b) => {
      const kiisseliObj = a.price.filter((fuel) => fuel.tag === '95')[0]
      const kiisseliObjB = b.price.filter((fuel) => fuel.tag === '95')[0]
      return kiisseliObj.price - kiisseliObjB.price
    })

    const kiisseli = kiisselit.sort((a, b) => {
      const kiisseliObj = a.price.filter((fuel) => fuel.tag === 'dsl')[0]
      const kiisseliObjB = b.price.filter((fuel) => fuel.tag === 'dsl')[0]

      if (!kiisseliObj || !kiisseliObjB) return 0
      return kiisseliObj.price - kiisseliObjB.price
    })

    const list = kiisseli.map((track) => {
      const kiisseliHinta = track.price.filter((fuel) => fuel.tag === 'dsl')[0]
      return {
        name: `${track.name}`,
        value: `Kiisseli: [${
          kiisseliHinta.price
        }€](https://www.google.com/maps/search/?api=1&query=${track.name
          .replace(' ', '%20')
          .replace(' ', '%20')
          .replace(' ', '%20')
          .replace(' ', '%20')
          .replace(' ', '%20')
          .replace(' ', '%20')
          .replace(' ', '%20')})`,
        inline: true
      }
    })

    const finalList = list.filter((a, i) => i < 3)

    const lopullinenList: any[] = []
    const ysiviisLista: Asema[] = []

    ysiviitoset.forEach((bensa) => {
      const ysiviisHinta = bensa.price.filter((fuel) => fuel.tag === '95')[0]
      ysiviisLista.push({
        ...bensa
      })

      lopullinenList.push({
        name: `${bensa.name}`,
        value: `95: [${
          ysiviisHinta.price
        }€](https://www.google.com/maps/search/?api=1&query=${bensa.name
          .replace(' ', '%20')
          .replace(' ', '%20')
          .replace(' ', '%20')
          .replace(' ', '%20')
          .replace(' ', '%20')})`,
        inline: true
      })
    })

    ysiviisLista[2] = ysiviitoset[ysiviitoset.length - 1]

    const list1 = lopullinenList.filter((a, i) => i < 3)
    // const ysiviisListaFiltered = ysiviisLista.filter((a, i) => i < 3)

    // // eslint-disable-next-line prefer-destructuring
    // ysiviisListaFiltered[3] = kiisseli[0];
    // // eslint-disable-next-line prefer-destructuring
    // ysiviisListaFiltered[4] = kiisseli[1];
    // ysiviisListaFiltered[5] = kiisseli[kiisseli.length - 1];

    list1[2] = lopullinenList[lopullinenList.length - 1]
    finalList[2] = list[list.length - 1]

    const listaaaa = [...list1, ...finalList]

    let title = 'Haluatko tankata edullisesti? Onnea.'

    if (interaction.user.id === '286963674990772226') {
      title = 'Ok tankkaa sitä kiisseliä vaikka sitten. Onnea verojen maksamisessa.'
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(
        'Tuossa näkyy 95 ja kiisselin hinnat. Ekana kaksi halvinta viimeisenä kallein.'
      )
      .addFields(listaaaa)
      .setTimestamp()
      .setFooter({ text: 'Tankkausbotti - Hinnat päivittyvät 10 min välein' })

    // const options: MessageSelectOptionData[] = ysiviisListaFiltered.map((asema) => {
    //   return {
    //     label: `${asema.name} - 95`,
    //     description: `${asema.address.street}`,
    //     value: `${asema._id}`
    //   }
    // })

    const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('tankille:listGas')
        .setLabel('Näytä koko lista')
        .setStyle(ButtonStyle.Secondary)
    )

    // const row2 = new MessageActionRow().addComponents(
    //   new MessageSelectMenu()
    //     .setCustomId('bensa-asema')
    //     .setPlaceholder('Mielenkiintoista, kerro lisää.')
    //     .addOptions([
    //       ...options,
    //       {
    //         label: 'Huijauskoodi irl',
    //         description: 'Tapa jolla säästät rahaa',
    //         value: 'olenkoyha'
    //       }
    //     ])
    // )

    await interaction
      .editReply({ embeds: [embed], components: [row1] })
      .catch((err) => console.log(err))
  }
}
