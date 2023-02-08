import { IBlocked } from './block.d'
import type { CommandInteraction, Message } from 'discord.js'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import getUrls from 'extract-urls'
import { container } from '@sapphire/framework'
import md5 from 'md5'

const prisma = container.prisma

let blocked: IBlocked[] = []

const permissions: string[] = [
  '214760917810937856', // leevi
  '270236553865854982', // jerry
  '229510730099982339', // jarkko
  '375364468634550273', // risto
  '230289238455746560' // topias
]

export async function checkMessage(message: Message) {
  if (message.author.bot || message.thread || !message.guild) return

  const urls = getUrls(message.content)

  if (!urls) {
    return
  }

  for (const url of [...urls]) {
    const hash = md5(url)

    for (const blockedObj of blocked) {
      if (blockedObj.hash !== hash) continue

      void message.delete()

      const dmChan = await message.author.createDM().catch(() => null)

      const timeout = await container.keyv.get<true>('settings:timeoutBlocked')
      if (timeout) {
        const time = await container.keyv.get('settings:timeoutBlockedTime')
        const currTime = Date.now()
        const banTime = currTime + (time ? time : 5000)

        void message.member
          ?.timeout(banTime, 'Postasi cringeä')
          .catch(() => container.logger.warn('Timeout ei onnistunut todennäköisesti PERM diff'))
      }

      dmChan
        ?.send(
          `Tuo on estetty joten älä laita tällästä. Tuon esti ukko nimeltä: ${
            blockedObj.blockerName ?? 'ei löytynyt nimeä koska roope trollas'
          }`
        )
        .catch(() => null)
    }
  }
}

export async function fetchBlocklist() {
  blocked = await prisma.blokattu.findMany()
}

export async function blockUrl(
  url: string,
  posterId: string,
  posterName: string,
  blockerName: string,
  blockerId: string
) {
  const hash = md5(url)
  const data = {
    url,
    hash,
    timestamp: new Date(),
    blockerId,
    blockerName,
    posterId,
    posterName
  }

  return await prisma.blokattu.create({
    data
  })
}

export function rawBlock(
  viesti: string,
  pId: string,
  pUser: string,
  username: string,
  id: string,
  message?: Message
) {
  const urls = getUrls(viesti)

  if (!urls) return

  const ulrArray = [...urls]
  ulrArray.forEach((url: string) => {
    blockUrl(url, pId, pUser, username, id)
      .catch(() => null)
      .catch((err) => {
        if (!message) return
        void message.channel.send(
          'Epäonnistui osoitteen ' + url + ' esto koska ' + JSON.stringify(err)
        )
      })
  })
}

export async function removeBlock(hash: string, md5bool: boolean, userId: string) {
  if (!permissions.includes(userId)) throw new Error('ei oikeuksia')

  const where = md5bool ? { hash: hash } : { url: hash }
  const res = await prisma.blokattu.deleteMany({
    where
  })

  return res.count
}

export function block(interaction: CommandInteraction) {
  if (!permissions.includes(interaction.user.id)) return interaction.reply('Mietis nyt vähän.')

  const value = interaction.options.get('message')
  const message = <Message>value?.message

  const urls = getUrls(message.content)

  if (!urls)
    return interaction.reply({
      content: `Kusetit mua eihän tossa ole edes linkkiä`,
      ephemeral: true
    })

  const ulrArray = [...urls]
  ulrArray.forEach((url: string) =>
    blockUrl(
      url,
      message.author.id,
      message.author.username,
      interaction.user.username,
      interaction.user.id
    ).catch(() => null)
  )

  void fetchBlocklist()
  void message.delete()

  void interaction.reply({
    content: `Ihan ok mutta jokin osa [tästä](${message.url}) viestistä meni estolistalle`,
    ephemeral: true
  })
}
