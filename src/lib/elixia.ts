import { fetch } from 'undici'

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
