import winston from 'winston'
import { FormatWrap } from 'logform'

export const levelUpperCase: FormatWrap = winston.format(
  (info: winston.Logform.TransformableInfo): winston.Logform.TransformableInfo => {
    if (info.level != null)
      info.level = info.level.toUpperCase()

    return info
  }
)
