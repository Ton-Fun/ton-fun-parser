import winston, {Logger} from 'winston'

const INFO: string = 'log/parser.log'
const ERROR: string = 'log/error.log'
const MAX_SIZE: number = 10 * 1024 * 1024

export default (): Logger => {
    return winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            new winston.transports.Console({
                format: winston.format.simple()
            }),
            new winston.transports.File({
                filename: INFO,
                maxsize: MAX_SIZE
            }),
            new winston.transports.File({
                filename: ERROR,
                level: 'error',
                maxsize: MAX_SIZE
            })
        ]
    })
}