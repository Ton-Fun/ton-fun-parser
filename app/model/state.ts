import { Db, Long } from 'mongodb'

export type ParserVersion = '1' | '2'

export const parserVersions: ParserVersion[] = ['1', '2']

export interface State {
  maxLt: Long
  maxHash: string
  parserLt: Long
  parseHash: string
  parserTargetLt: Long
  parserTargetHash: string
  version: ParserVersion
}

export function defaultState (version: ParserVersion): State {
  return {
    maxLt: new Long(0),
    maxHash: '',
    parserLt: new Long(0),
    parseHash: '',
    parserTargetLt: new Long(0),
    parserTargetHash: '',
    version
  }
}

export const getState = async (db: Db, version: ParserVersion): Promise<State> => {
  return await db.collection<State>('state')
    .findOne({ version: { $eq: version } }, { projection: { _id: 0 } }) ?? defaultState(version)
}
