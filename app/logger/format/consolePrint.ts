import winston from 'winston'
import * as util from 'util'

export const consolePrint = (info: winston.Logform.TransformableInfo): string => {
  const {
    timestamp,
    level,
    message,
    ...args
  } = info

  let data: string = ''

  // Remove Symbols and colorize
  if ((Object.keys(args).length > 0) || args == null) {
    const result: any = {}
    for (const key in args) {
      result[key] = args[key]
    }
    data = util.inspect(result, { colors: true, depth: null })
  }

  return `${timestamp as string} [${level}]: ${message as string} ${data}`
}
