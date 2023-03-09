import cron from 'node-cron'
import { getHourly } from '@jeffe/nordpool'
import { container } from '@sapphire/framework'
// import { logger } from '../logger'
import { DateTime } from 'luxon'
import { ActivityType } from 'discord.js'

async function setCustomStatus() {
  const res = await getHourly({
    area: 'FI',
    vat: 10,
    timezone: 'Europe/Helsinki'
  })

  const currPrice = res.find((hourly) => {
    const time = DateTime.fromISO(hourly.startTime, { zone: 'Europe/Oslo' }).plus({ hours: 1 })
    return time.diffNow('minutes').toObject().minutes! > 30
  })

  // logger.info('setCustomStatus', {
  //   res,
  //   currPrice
  // })

  if (!currPrice) return console.log('Ei löytynyt hintaa. Mikä meni rikki?')

  container.client.user?.setActivity(`Sähkö ${currPrice.price} c/kWh`, {
    type: ActivityType.Watching
  })
}

export function initNordpool() {
  container.logger.info('Nordpool init')

  cron.schedule('*/15 * * * *', () => {
    void setCustomStatus()
  })

  void setCustomStatus()
}
