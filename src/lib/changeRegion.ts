import {
  ButtonInteraction,
  Interaction,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  SelectMenuInteraction
} from 'discord.js'

async function vaihdaRegion(interaction: Interaction, region?: string) {
  if (!interaction.inCachedGuild())
    throw new Error('Friikki ei guildia error (ei pitäs olla mahdollista)')

  const vc = interaction.member.voice.channel!
  let uusiRegion = vc.rtcRegion == 'rotterdam' ? 'russia' : 'rotterdam'
  if (region) {
    uusiRegion = region
  }
  await vc.setRTCRegion(uusiRegion)
}

async function handleRegionValintaSelectMenu(
  interaction: SelectMenuInteraction
) {
  if (!interaction.inCachedGuild())
    throw new Error('Friikki ei guildia error (ei pitäs olla mahdollista)')
  const vc = interaction.member.voice.channel!
  const region = interaction.values[0]

  const componentRow2 = new MessageActionRow().addComponents([
    new MessageButton()
      .setLabel('Tää oli huono idea vaiha takas nyt äkkiä.')
      .setCustomId('cr:choice')
      .setEmoji('717842037440905286')
      .setStyle('SECONDARY'),
    new MessageButton()
      .setLabel('Done')
      .setCustomId('cr:removeMessage')
      .setStyle('SECONDARY')
  ])

  await vaihdaRegion(interaction, region)
  await interaction.update({
    content: `Kanavan <#${vc.id}> region muutettiin. Uusi region: ${region}`,
    components: [componentRow2]
  })
}

function regionValintaDropdown(interaction: ButtonInteraction) {
  if (!interaction.inCachedGuild())
    throw new Error('Friikki ei guildia error (ei pitäs olla mahdollista)')

  const vc = interaction.member.voice.channel!
  const currentRegion = vc.rtcRegion
  const options = [
    {
      description: 'Europe',
      label: 'EU',
      value: 'rotterdam',
      default: currentRegion == 'rotterdam'
    },
    {
      description: 'Russia',
      label: 'RU',
      value: 'russia',
      default: currentRegion == 'russia'
    },
    {
      description: 'India',
      label: 'IN',
      value: 'india',
      default: currentRegion == 'india'
    },
    {
      description: 'Brazil',
      label: 'BR',
      value: 'brazil',
      default: currentRegion == 'brazil'
    },
    {
      description: 'Japan',
      label: 'JP',
      value: 'japan',
      default: currentRegion == 'japan'
    }
  ]

  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('cr:choiceMenu')
      .setPlaceholder('Valitse todella tarkkaan')
      .addOptions(options)
  )

  const row2 = new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel('Ei sittenkään')
      .setCustomId('cr:removeMessage')
      .setStyle('SECONDARY')
  )

  void interaction.update({
    content: 'Valitse nyt kun halusitki',
    components: [row, row2]
  })
}

export { vaihdaRegion, regionValintaDropdown, handleRegionValintaSelectMenu }
