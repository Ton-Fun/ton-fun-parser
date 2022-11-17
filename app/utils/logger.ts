import winston, {Logger} from 'winston'

export default (): Logger => {
    const info: string = 'log/parser.log'
    const error: string = 'log/error.log'
    const maxSize: number = 10 * 1024 * 1024 // 10 MB

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
                filename: info,
                maxsize: maxSize
            }),
            new winston.transports.File({
                filename: error,
                level: 'error',
                maxsize: maxSize
            })
        ]
    })
}