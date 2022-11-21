import { Logger } from 'winston'

enum KillerLogs {
  INTERRUPTION = 'SIGNAL INTERRUPTION',
  USER_DEFINED_ONE = 'SIGNAL USER_DEFINED ONE',
  USER_DEFINED_TWO = 'SIGNAL USER_DEFINED TWO',
  UNCAUGHT_EXCEPTION = 'SIGNAL UNCAUGHT EXCEPTION'
}

export function killer (logger: Logger): void {
  function finish (message: string): void {
    logger.info(message)
    logger.end((): void => process.exit(0))
  }

  function finishWithError (message: string): void {
    logger.error(message)
    logger.end((): void => process.exit(1))
  }

  process.on('SIGINT', (): void => finish(KillerLogs.INTERRUPTION)) // CTRL+C in terminal
  process.on('SIGUSR1', (): void => finish(KillerLogs.USER_DEFINED_ONE)) // `kill pid`
  process.on('SIGUSR2', (): void => finish(KillerLogs.USER_DEFINED_TWO)) // `kill pid`
  process.on('uncaughtException', (): void => finishWithError(KillerLogs.UNCAUGHT_EXCEPTION))
}
