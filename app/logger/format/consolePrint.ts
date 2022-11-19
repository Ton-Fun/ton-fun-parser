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
    if (Object.keys(args).length || args) {
        const result: any = {}
        for (let key in args)
            result[key] = args[key]
        data = util.inspect(result, { colors: true, depth: null})
    }

    return `${timestamp} [${level}]: ${message} ${data}`
}