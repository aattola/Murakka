import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { Client } from 'discord.js'
import { fetchBlocklist } from '../lib/block'
import { initNordpool } from '../lib/nordpool'
import { initElixiaLoop } from '../lib/elixia'

@ApplyOptions<ListenerOptions>({
  event: 'ready'
})
export class UserEvent extends Listener {
  public run(client: Client) {
    const { username, id } = client.user!
    this.container.logger.info(`Kirjauduttu sisään! ${username} (${id})`)

    initNordpool()
    initElixiaLoop()
    void fetchBlocklist()
    // void initFifa()
  }
}
