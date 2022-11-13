export type Bet = {
    lt: string
    hash: string
    time: number
    address: string
    value: string
    win: boolean
}

export type State = {
    maxLt: string
    maxHash: string
    parserLt: string
    parseHash: string
    parserTargetLt: string
    parserTargetHash: string
}