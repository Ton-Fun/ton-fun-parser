import winston from 'winston'
import { FormatWrap } from 'logform'

const TIMESTAMP_LENGTH: number = 19

export const prettifyTimestamp: FormatWrap = winston.format(
  (info: winston.Logform.TransformableInfo): winston.Logform.TransformableInfo => {
    if (info.timestamp != null)
      info.timestamp = info.timestamp.slice(0, TIMESTAMP_LENGTH).replace('T', ' ')
    return info
  })
