import { container } from '@sapphire/framework'
import { InfluxDB } from '@influxdata/influxdb-client'

declare module '@sapphire/pieces' {
  interface Container {
    influxDB: InfluxDB
  }
}

function initInfluxDB() {
  container.influxDB = new InfluxDB({
    url: 'https://eu-central-1-1.aws.cloud2.influxdata.com',
    token: process.env.INFLUXDB_TOKEN
  })
}

export { initInfluxDB }
