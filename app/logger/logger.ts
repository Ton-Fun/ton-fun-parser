import winston, {Logger} from 'winston'
import {prettifyTimestamp} from './format/prettifyTimestamp'
import {grayTimestamp} from './format/grayTimestamp'
import {levelUpperCase} from './format/levelUpperCase'
import {consolePrint} from './format/consolePrint'
import {readString} from '../util/env'
import * as Transport from 'winston-transport'

const INFO: string = 'log/parser.log'
const ERROR: string = 'log/error.log'
const MAX_SIZE: number = 10 * 1024 * 1024

export default (): Logger => {
    const consoleLog: string = readString(process.env.CONSOLE_LOG)
    const file: winston.Logform.Format = winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
    const transports: Transport[] = [
        new winston.transports.File({
            format: file,
            filename: INFO,
            maxsize: MAX_SIZE
        }),
        new winston.transports.File({
            format: file,
            filename: ERROR,
            maxsize: MAX_SIZE,
            level: 'error'
        })
    ]
    if (consoleLog)
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
    return winston.createLogger({
        transports
    })
}