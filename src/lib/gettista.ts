import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from 'discord.js'

function gettistä(message: Message) {
  const idSplit = message.id.split('')
  if (idSplit[idSplit.length - 1] === idSplit[idSplit.length - 2]) {
    if (idSplit[idSplit.length - 2] === idSplit[idSplit.length - 3]) {
      if (idSplit[idSplit.length - 3] === idSplit[idSplit.length - 4]) {
        if (idSplit[idSplit.length - 4] === idSplit[idSplit.length - 5]) {
          return message.reply({
            content: `HYVÄ **PENTA GETTI UKKO** ${message.id}`,
            files: ['https://i.imgur.com/hwNEPfz.jpeg']
          })
        }
        return message.reply({
          content: `HALOOOOO **QUADROT** ${message.id}`,
          files: ['https://i.imgur.com/UHndwBg.png']
        })
      }
      return message.reply(`HALOOOOO **TRIPLAT** ${message.id}`)
    }
    return message.reply(`MORO **TUPLAT** ${message.id}`)
  }

  const rNumber = Math.round(Math.random() * 100)
  if (rNumber >= 95) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('gettista:komppaan')
        .setStyle(ButtonStyle.Primary)
        .setLabel('Komppaan'),
      new ButtonBuilder()
        .setCustomId('gettista:palautetta')
        .setStyle(ButtonStyle.Secondary)
        .setLabel('Annan rakentavaa palautetta')
    )

    return message.reply({
      content: `Mitäs jos gettaamisen sijasta gettaisit itsellesi ämmiä: ${message.id}`,
      components: [row]
    })
  }

  const rNumber2 = Math.round(Math.random() * 100)
  if (message.author.id === '286963674990772226') {
    if (rNumber2 >= 90) {
      void message.reply({
        content: `Gettistä: ${message.id}`,
        files: ['https://i.imgur.com/HFuerqW.png']
      })
      return
    }
  }

  void message.reply(`Gettistä: ${message.id}`)
}

export async function handleGet(message: Message) {
  if (message.author.bot) return

  // if (message.content.toLowerCase().includes('ni11a'.replace('11', 'gg'))) {
  //   if (message.author.bot) return
  //   await message.reply({
  //     content: `NYT OMPI SITÄ PEISETTIÄ JATKA SAMAAN MALLIIN POSTAAMISTA`,
  //     files: ['https://i.imgur.com/Psqr2Hc.png']
  //   })
  // }

  if (message.content.toLowerCase() === 'get') {
    // gettistä
    void gettistä(message)
  }

  if (message.content.toLowerCase() === 'gettistä') {
    // gettistä
    void gettistä(message)
  }
}
