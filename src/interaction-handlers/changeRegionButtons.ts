import {
  InteractionHandler,
  InteractionHandlerTypes,
  PieceContext,
  UserError
} from '@sapphire/framework'
import type { ButtonInteraction } from 'discord.js'
import { Message } from 'discord.js'
import { regionValintaDropdown } from '../lib/changeRegion'

export class ChangeRegionButtonHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button
    })
  }
  public override parse(interaction: ButtonInteraction) {
    if (interaction.customId.startsWith('cr:')) return this.some()
    return this.none()
  }

  public async run(interaction: ButtonInteraction) {
    if (!interaction.inCachedGuild())
      throw new Error('Friikki ei guildia error (ei pitäs olla mahdollista)')

    const vc = interaction.member.voice?.channel
    if (!vc)
      throw new UserError({
        message:
          'Et ole missään äänikanavassa. Yritäppä uudelleen sen jälkeen kun olet liittynyt yhteen.',
        identifier: 'JFF',
        context: { ephemeral: true }
      })

    switch (interaction.customId) {
      case 'cr:removeMessage':
        await (interaction.message as Message).delete()
        break
      case 'cr:choice':
        regionValintaDropdown(interaction)
        break
    }
  }
}
