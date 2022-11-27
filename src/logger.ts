import winston from 'winston'
import { Logtail } from '@logtail/node'
import { LogtailTransport } from '@logtail/winston'
const logtail = new Logtail(process.env.LOGTAIL!)

const { combine, timestamp, prettyPrint, printf } = winston.format

const form = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${process.env.NODE_ENV ?? 'dev'} ${level}: ${message}`
})

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    prettyPrint(),
    winston.format.prettyPrint(),
    form,
    winston.format.colorize()
  ),
  defaultMeta: {
    env: process.env.NODE_ENV ?? 'dev'
  },
  transports: [new winston.transports.Console(), new LogtailTransport(logtail)]
})

export { logger }
