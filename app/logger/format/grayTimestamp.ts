import { gray } from 'colors/safe'
import { FormatWrap } from 'logform'
import winston from 'winston'

export const grayTimestamp: FormatWrap = winston.format(
  (info: winston.Logform.TransformableInfo): winston.Logform.TransformableInfo => {
    if (info.timestamp != null)
      info.timestamp = gray(info.timestamp)
    return info
  })
