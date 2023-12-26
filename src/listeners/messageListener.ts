import { ApplyOptions } from '@sapphire/decorators'
import { container, Listener, ListenerOptions } from '@sapphire/framework'
import { Message } from 'discord.js'
import { checkMessage } from '../lib/block'
import { handleKonna } from '../lib/konna'
import { Nettiauto } from '../lib/nettiauto'
import { handleGet } from '../lib/gettista'

const nettiauto = new Nettiauto()
@ApplyOptions<ListenerOptions>({
  event: 'messageCreate'
})
export class UserEvent extends Listener {
  public run(message: Message) {
    void container.keyv.set(`lastMessage:${message.author.id}`, message.content)
    void handleKonna(message)
    void checkMessage(message)
    void handleGet(message)
    void nettiauto.onMessage(message)
  }
}
