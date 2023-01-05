import { ApplyOptions } from '@sapphire/decorators'
import { container, Listener, ListenerOptions } from '@sapphire/framework'
import { Message } from 'discord.js'
import { checkMessage } from '../lib/block'
import { handleKonna } from '../lib/konna'

@ApplyOptions<ListenerOptions>({
  event: 'messageCreate'
})
export class UserEvent extends Listener {
  public run(message: Message) {
    void container.keyv.set(`lastMessage:${message.author.id}`, message.content)
    void checkMessage(message)
    void handleKonna(message)
  }
}
