import { container } from '@sapphire/framework'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

declare module '@sapphire/pieces' {
  interface Container {
    sentry: typeof Sentry
  }
}

function initSentry() {
  Sentry.init({
    dsn: 'https://ed8634031d35418f9c86536413fa8986@o124657.ingest.sentry.io/6710413',
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Prisma({ client: container.prisma })
    ]
  })

  container.sentry = Sentry
}

export { initSentry }
