import { fetch } from 'undici'
import { Point } from '@influxdata/influxdb-client'
import { container } from '@sapphire/framework'
import cron from 'node-cron'
const writer = container.influxDB.getWriteApi('09fa4a7e13139f5d', 'elixia')

interface Visitors {
  totalCheckIns: number
  ptAppointments: number
  gymTraining: number
  groupExercise: number
  clubCapacity: number
}
interface ElixiaApiResponse {
  payload: {
    centerId: number
    currentVisitorLoad: Visitors
  }
}
export async function getElixiaVisitors(centerId = 737) {
  const resp = await fetch(`https://hfnapi.sats.com/satsweb/centers/${centerId}/visitor-load`)
  const visitorData = await resp.json()

  return visitorData as ElixiaApiResponse
}

export function initElixiaLoop() {
  container.logger.info('Elixia loop init')

  cron.schedule('*/1 * * * *', () => {
    void getElixiaDBLoop()
  })
}

export async function getElixiaDBLoop() {
  const visitorData = await getElixiaVisitors().catch(() => null)
  if (!visitorData) return
  if (!visitorData.payload) return
  if (!visitorData.payload.currentVisitorLoad) return

  const point = new Point('visitors')
    .tag('gym', '737')
    .floatField('visitors', visitorData.payload.currentVisitorLoad.gymTraining)
    .floatField('totalCheckIns', visitorData.payload.currentVisitorLoad.totalCheckIns)
    .floatField('clubCapacity', visitorData.payload.currentVisitorLoad.clubCapacity)
    .floatField('groupExercise', visitorData.payload.currentVisitorLoad.groupExercise)

  writer.writePoint(point)
}
