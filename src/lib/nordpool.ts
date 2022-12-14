import cron from 'node-cron'
import { getHourly } from '@jeffe/nordpool'
import { formatISO, subHours } from 'date-fns'
import { container } from '@sapphire/framework'
import { logger } from '../logger'
import { DateTime } from 'luxon'

async function setCustomStatus() {
  const res = await getHourly({
    area: 'FI',
    vat: 10
  })
  const result = formatISO(subHours(new Date(), 1)).split(':')[0]

  const currPrice = res.find((hourly) => {
    const time = DateTime.fromISO(hourly.startTime, { zone: 'Europe/Oslo' }).plus({ hours: 1 })
    return time.diffNow('minutes').toObject().minutes! > 30
  })

  logger.info('setCustomStatus', {
    result,
    res,
    currPrice
  })

  if (!currPrice) return console.log('Ei löytynyt hintaa. Mikä meni rikki?', result)

  container.client.user?.setActivity(`Sähkö ${currPrice.price} c/kWh`, { type: 'WATCHING' })
}

export function initNordpool() {
  container.logger.info('Nordpool init')

  cron.schedule('*/15 * * * *', () => {
    void setCustomStatus()
  })

  void setCustomStatus()
}
