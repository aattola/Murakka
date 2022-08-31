import { Precondition } from '@sapphire/framework'
import type {
  CommandInteraction,
  ContextMenuInteraction,
  Message
} from 'discord.js'

export class IsOwnerPrecondition extends Precondition {
  private isOwner(id: string) {
    return id === '214760917810937856'
      ? this.ok()
      : this.error({ message: 'Et ole botin omistaja eli et käytä tätä.' })
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    return this.isOwner(interaction.user.id)
  }

  public override async contextMenuRun(interaction: ContextMenuInteraction) {
    return this.isOwner(interaction.user.id)
  }

  public override async messageRun(message: Message) {
    return this.isOwner(message.author.id)
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    isOwner: never
  }
}
