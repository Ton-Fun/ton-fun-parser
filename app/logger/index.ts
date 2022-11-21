import winston, { Logger } from 'winston'
import { prettifyTimestamp } from './format/prettifyTimestamp'
import { grayTimestamp } from './format/grayTimestamp'
import { levelUpperCase } from './format/levelUpperCase'
import { consolePrint } from './format/consolePrint'
import { readString } from '../util/env'
import * as Transport from 'winston-transport'

export interface LoggerConfig {
  info: string
  error: string
  maxSize: number
}

export function createLogger (config: LoggerConfig): Logger {
  const consoleLog: string = readString(process.env.CONSOLE_LOG)
  const file: winston.Logform.Format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
  const transports: Transport[] = [
    new winston.transports.File({
      format: file,
      filename: config.info,
      maxsize: config.maxSize
    }),
    new winston.transports.File({
      format: file,
      filename: config.error,
      maxsize: config.maxSize,
      level: 'error'
    })
  ]
  if (consoleLog != null) {
    transports.push(new winston.transports.Console({
      format: winston.format.combine(
        levelUpperCase(),
        winston.format.colorize(),
        winston.format.timestamp(),
        prettifyTimestamp(),
        grayTimestamp(),
        winston.format.printf(consolePrint)
      )
    }))
  }
  return winston.createLogger({ transports })
}
