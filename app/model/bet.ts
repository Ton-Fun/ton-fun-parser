import { Long } from 'mongodb'

export interface Bet {
  lt: Long
  hash: string
  time: Long
  address: string
  value: Long
  win: boolean
  version: string
}
