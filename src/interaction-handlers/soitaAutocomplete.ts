import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework'
import type { AutocompleteInteraction } from 'discord.js'
import YouTube from 'youtube-sr'

export class HakusanaAutocompleteHandler extends InteractionHandler {
  public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Autocomplete
    })
  }

  public override async run(
    interaction: AutocompleteInteraction,
    result: InteractionHandler.ParseResult<this>
  ) {
    return interaction.respond(result)
  }

  public override async parse(interaction: AutocompleteInteraction) {
    // komento id soita 1050407481647566869
    if (interaction.commandId !== '1050407481647566869') return this.none()

    // Get the focussed (current) option
    const focusedOption = interaction.options.getFocused(true)

    try {
      if (focusedOption.name === 'hakusana') {
        if (!focusedOption.value || focusedOption.value === '') {
          return this.some([{ name: 'Hae nyt jotain', value: 'JFFe___________SqMRyyL958w' }])
        }

        const videos = await YouTube.search(focusedOption.value, {
          type: 'video',
          limit: 5
        })

        if (videos.length === 0) {
          return this.none()
        }

        const autocompleteVideos = videos.map((video) => {
          return {
            name: video.title!,
            value: `JFFe___________${video.id!}`
          }
        })

        return this.some(autocompleteVideos || [])
      }
    } catch (e) {
      return this.none()
    }

    return this.none()
  }
}
