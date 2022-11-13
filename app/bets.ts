export type Bet = {
    lt: string
    hash: string
    unixTime: number
    address: string
    value: string
    win: boolean
}

export const stubBets: Bet[] = [
    {
        lt: '32804721000001',
        hash: 'jINIK6D7L6N2rimla6qkwz5wC1kOueFLoJLtAK8jgyc=',
        value: "6000000000",
        win: true,
        address: 'EQCtCC-ChSrV_H-3yWK2ciAwdLzmEHymrZXXubzv4PtCVWP8',
        unixTime: 1668205098
    },
    {
        lt: '32804743000001',
        hash: '4ABCfw3gxZc05BeSIXyw1P1WX1frnWnNwKiCav+hTgY=',
        unixTime: 1668205120,
        address: 'EQCtCC-ChSrV_H-3yWK2ciAwdLzmEHymrZXXubzv4PtCVWP8',
        value: "7000000000",
        win: false
    },
    {
        lt: '32804763000001',
        hash: 'h2dhJmqrVTuUzkCSoerCTDc7aw8btsr4CYTZLw76HB4=',
        unixTime: 1668205140,
        address: 'EQDa_T-plbicZOR188te6gp9T1J4XKd7wA7DUMyKCnFMm_DR',
        value: "3000000000",
        win: false
    },
    {
        lt: '32804779000001',
        hash: 'nufjoG0vTSEFVsz5XzRWVM9vtPKAOAZemhTn6pyK0yU=',
        value: "1000000000",
        win: true,
        address: 'EQDa_T-plbicZOR188te6gp9T1J4XKd7wA7DUMyKCnFMm_DR',
        unixTime: 1668205156
    }
]