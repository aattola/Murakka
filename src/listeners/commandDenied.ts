import { ApplyOptions } from '@sapphire/decorators'
import type {
  ChatInputCommandDeniedPayload,
  ListenerOptions,
  UserError
} from '@sapphire/framework'
import { Listener } from '@sapphire/framework'
import humanize from 'humanize-duration'

@ApplyOptions<ListenerOptions>({
  event: 'chatInputCommandDenied'
})
export class CommandDeniedListener extends Listener {
  public async run(error: UserError, ctx: ChatInputCommandDeniedPayload) {
    if (Reflect.get(Object(error.context), 'silent'))
      return this.container.logger.info(error.message)

    if (error.identifier === 'preconditionCooldown') {
      const { remaining } = error.context as { remaining: number }
      return await ctx.interaction.reply(
        `Sinua kuule rajoitetaan raa'asti vielä ${humanize(remaining, {
          language: 'fi'
        })}`
      )
    }

    return ctx.interaction.reply({
      content: error.message,
      ephemeral: !!Reflect.get(Object(error.context), 'ephemeral')
    })
  }
}
