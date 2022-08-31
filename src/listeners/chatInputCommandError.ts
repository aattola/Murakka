import { ApplyOptions } from '@sapphire/decorators'
import {
  ChatInputCommandErrorPayload,
  Events,
  Listener,
  ListenerOptions,
  UserError
} from '@sapphire/framework'
import { CommandInteraction, DiscordAPIError, HTTPError } from 'discord.js'
import { codeBlock, userMention } from '@discordjs/builders'
import { RESTJSONErrorCodes } from 'discord-api-types/v10'

const ignoredCodes = [
  RESTJSONErrorCodes.UnknownChannel,
  RESTJSONErrorCodes.UnknownMessage
]

@ApplyOptions<ListenerOptions>({
  event: 'chatInputCommandError'
})
export class CommandErrorListener extends Listener<
  typeof Events.ChatInputCommandError
> {
  private getWarnError(interaction: CommandInteraction) {
    return `ERROR: /${interaction.guildId}/${interaction.channelId}/${interaction.id}`
  }

  private generateUnexpectedErrorMessage(
    interaction: CommandInteraction,
    error: any
  ) {
    if (interaction.user.id === '214760917810937856')
      return codeBlock('js', error.stack!)
    return `Hei nyt tapahtui yllättävä virhe voitko ilmoitella tästä eteenpäin?`
  }

  private reply(
    interaction: CommandInteraction,
    content: string,
    ephemeral = true
  ) {
    if (interaction.replied || interaction.deferred) {
      return interaction.editReply({
        content
      })
    }

    return interaction.reply({
      content,
      ephemeral: ephemeral
    })
  }

  private stringError(interaction: CommandInteraction, error: string) {
    return this.reply(
      interaction,
      `Hei ${userMention(interaction.user.id)}, ${error}`
    )
  }

  private userError(interaction: CommandInteraction, error: UserError) {
    if (Reflect.get(Object(error.context), 'silent')) return

    return this.reply(
      interaction,
      error.message ||
        `Virhe tapahtui josta palautuminen kestää 2-3 arkipäivää`,
      !!Reflect.get(Object(error.context), 'ephemeral')
    )
  }

  public override async run(
    error: any,
    { command, interaction }: ChatInputCommandErrorPayload
  ) {
    const { logger, client } = this.container

    if (typeof error === 'string') return this.stringError(interaction, error)
    if (error instanceof UserError) return this.userError(interaction, error)

    if (
      error.name === 'AbortError' ||
      error.message === 'Internal Server Error'
    ) {
      logger.warn(
        `${this.getWarnError(interaction)} (${interaction.user.id}) | ${
          error.constructor.name
        }`
      )
      return this.reply(
        interaction,
        'Netillä oli ongelmia ottaa yhteyttä discordiin. Yritäppä uudelleen.'
      )
    }

    if (error instanceof DiscordAPIError || error instanceof HTTPError) {
      if (ignoredCodes.includes(error.code)) {
        return
      }

      client.emit(Events.Error, error)
    } else {
      logger.warn(
        `${this.getWarnError(interaction)} (${interaction.user.id}) | ${
          error.constructor.name
        }`
      )
    }

    // Emit where the error was emitted
    logger.fatal(
      `[COMMAND] ${command.location.full}\n${error.stack || error.message}`
    )
    try {
      await this.reply(
        interaction,
        this.generateUnexpectedErrorMessage(interaction, error)
      )
    } catch (err) {
      client.emit(Events.Error, err as Error)
    }

    return undefined
  }
}
