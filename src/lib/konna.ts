import { DateTime } from 'luxon'
import { Message } from 'discord.js'

const Kuka = [
  'Pahvihousu',
  'Vasikka',
  'Ötökkä',
  'Konna',
  'Apina',
  'Hippi',
  'Paksu-Pekka',
  'Torakka',
  'Kyttä',
  'Khänäreitten everstiluutnantti'
]

const Mitä = [
  'teloitettiin',
  'vedettiin',
  'hapetettiin',
  'käsiteltiin',
  'pamputettiin',
  'kuristettiin',
  'paketoitiin',
  'ammuttiin',
  'teurastettiin',
  'juoksutettiin'
]

const Mihin = [
  'yhteistyöhaluiseksi',
  'levyksi',
  'roskaksi',
  'tajuttomaksi',
  'hengiltä',
  'matalaksi',
  'siniseksi',
  'kondikseen',
  'kylmäksi',
  'hiljaiseksi'
]

const Missä = [
  'salilla',
  'kongoilla',
  'kivitalossa',
  'kerholla',
  'possessa',
  'Pikku-Ellun kämpällä',
  'kyttiksellä',
  'baarissa',
  'rosiksessa',
  'putkassa'
]
function getKonnaResponse(id: string, timestamp: number) {
  const split = id.split('')
  const last3 = split.slice(split.length - 3, split.length)

  const kuka = Kuka[parseInt(last3[0])]
  const mitä = Mitä[parseInt(last3[1])]
  const mihin = Mihin[parseInt(last3[2])]

  const time = DateTime.fromSeconds(timestamp)
  const aika = String(time.second).split('')
  const viimeinen = aika[aika.length - 1]
  const viimeinenNumero = parseInt(viimeinen)

  const missä = Missä[viimeinenNumero]

  return `${kuka} ${mitä} ${mihin} ${missä} <:immu:1060580729525895178>`
}

export async function handleKonna(message: Message) {
  const konna = getKonnaResponse(message.id, message.createdTimestamp)
  if (message.content !== 'konna') return

  await message.reply(konna)
}
