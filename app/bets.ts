export type Bet = {
    value: string
    win: boolean
    address: string
    unixTime: number
}

export const stubBets: Bet[] = [
    {
        value: "6000000000",
        win: true,
        address: 'EQCtCC-ChSrV_H-3yWK2ciAwdLzmEHymrZXXubzv4PtCVWP8',
        unixTime: 1668205098
    },
    {
        value: "7000000000",
        win: false,
        address: 'EQCtCC-ChSrV_H-3yWK2ciAwdLzmEHymrZXXubzv4PtCVWP8',
        unixTime: 1668205120
    },
    {
        value: "3000000000",
        win: false,
        address: 'EQDa_T-plbicZOR188te6gp9T1J4XKd7wA7DUMyKCnFMm_DR',
        unixTime: 1668205140
    },
    {
        value: "1000000000",
        win: true,
        address: 'EQDa_T-plbicZOR188te6gp9T1J4XKd7wA7DUMyKCnFMm_DR',
        unixTime: 1668205156
    }
]