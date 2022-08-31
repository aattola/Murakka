import {
  InteractionHandler,
  InteractionHandlerTypes,
  PieceContext,
  UserError
} from '@sapphire/framework'
import type { SelectMenuInteraction } from 'discord.js'
import { handleRegionValintaSelectMenu } from '../lib/changeRegion'

export class ChangeRegionSelectMenuHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.SelectMenu
    })
  }
  public override parse(interaction: SelectMenuInteraction) {
    if (interaction.customId.startsWith('cr:')) return this.some()
    return this.none()
  }

  public async run(interaction: SelectMenuInteraction) {
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
      case 'cr:choiceMenu':
        await handleRegionValintaSelectMenu(interaction)
        break
    }
  }
}
