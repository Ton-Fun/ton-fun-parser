# API

# Table of content

- [health](#get-health)
- [state](#get-state)
- [summary](#get-summary)
- [players](#get-players)
- [players/:version](#get-playersversion)
- [players/:address](#get-playeraddress)
- [bets](#get-bets)
- [bets/stream](#get-betsstream)
- [bets/total](#get-betstotal)

## GET `/health`

```shell
curl -s https://parser.tonbot.fun/health | jq
```

```json
{
  "success": "OK"
}
```

## GET `/state`

```shell
curl -s https://parser.tonbot.fun/state | jq
```

```json
[
  {
    "version": "1",
    "maxHash": "EjB9poAV6vXd6JM0Ca3c1KNhWEhRVlaqflcAwZc4Etk=",
    "maxLt": 32759617000003,
    "parseHash": "",
    "parserLt": 0,
    "parserTargetHash": "EjB9poAV6vXd6JM0Ca3c1KNhWEhRVlaqflcAwZc4Etk=",
    "parserTargetLt": 32759617000003,
    "scraped": 6966
  },
  {
    "version": "2",
    "maxHash": "9XZD0fgWKZkf8mCkyxxliK5HPMHMF6xsm7sW9uEja48=",
    "maxLt": 32954972000001,
    "parseHash": "",
    "parserLt": 0,
    "parserTargetHash": "9XZD0fgWKZkf8mCkyxxliK5HPMHMF6xsm7sW9uEja48=",
    "parserTargetLt": 32954972000001,
    "scraped": 7876
  }
]
```

## GET `/summary`

```shell
curl -s https://parser.tonbot.fun/summary | jq
```

```json
{
  "1": {
    "players": 355,
    "betsValue": 165384790919333,
    "winsValue": 143294180243488,
    "bets": 6966,
    "wins": 3335,
    "maxBet": 5364434569086,
    "maxWin": 5364441136092,
    "firstBetTimestamp": 1645157840,
    "lastBetTimestamp": 1668144080
  },
  "2": {
    "players": 107,
    "betsValue": 31087038244329,
    "winsValue": 25059181053786,
    "bets": 7811,
    "wins": 3147,
    "maxBet": 800000000000,
    "maxWin": 1600000000000,
    "firstBetTimestamp": 1666997915,
    "lastBetTimestamp": 1668646463
  },
  "total": {
    "players": 437,
    "betsValue": 196471829163662,
    "winsValue": 168353361297274,
    "bets": 14777,
    "wins": 6482,
    "maxBet": 5364434569086,
    "maxWin": 5364441136092,
    "firstBetTimestamp": 1645157840,
    "lastBetTimestamp": 1668646463
  }
}
```

## GET `/players`

```shell
curl -s https://parser.tonbot.fun/players?orderBy=betsValue&sort=desc | jq
```

- `orderBy` - optional. Available values:
    - `betsValue`
    - `winsValue`
    - `bets`
    - `wins`
    - `maxBet`
    - `maxWin`
    - `firstBetTimestamp`
    - `lastBetTimestamp`
    - `profit`
- `sort` - optional. Available values:
    - `asc`
    - `desc`

```json
[
  {
    "betsValue": 2059170000000,
    "winsValue": 1108760000000,
    "bets": 148,
    "wins": 61,
    "maxBet": 390000000000,
    "maxWin": 200000000000,
    "firstBetTimestamp": 1667165124,
    "lastBetTimestamp": 1668369935,
    "address": "EQB5dU4DfFVlE5N_VQHmNAo3EXRBhEnBqxp26Y5zFiphWcle",
    "profit": -950410000000
  },
  {
    "betsValue": 18057530000000,
    "winsValue": 14551360000000,
    "bets": 6104,
    "wins": 2459,
    "maxBet": 3010000000,
    "maxWin": 6020000000,
    "firstBetTimestamp": 1667000862,
    "lastBetTimestamp": 1667004763,
    "address": "EQCztAMYomEAUAadH4X-Vz0oygMIPvvxYJOoxUQkpLqpsrji",
    "profit": -3506170000000
  }
]
```

## GET `/players/:version`

```shell
curl -s https://parser.tonbot.fun/players/1?orderBy=betsValue&sort=desc | jq
```

- `version` - Version of game. Available values:
    - `1`
    - `2`
- `orderBy` - Optional. Available values:
    - `betsValue` - default
    - `winsValue`
    - `bets`
    - `wins`
    - `maxBet`
    - `maxWin`
    - `firstBetTimestamp`
    - `lastBetTimestamp`
    - `profit`
- `sort` - Optional. Available values:
    - `asc` - default
    - `desc`

```json
[
  {
    "betsValue": 2059170000000,
    "winsValue": 1108760000000,
    "bets": 148,
    "wins": 61,
    "maxBet": 390000000000,
    "maxWin": 200000000000,
    "firstBetTimestamp": 1667165124,
    "lastBetTimestamp": 1668369935,
    "address": "EQB5dU4DfFVlE5N_VQHmNAo3EXRBhEnBqxp26Y5zFiphWcle",
    "profit": -950410000000
  },
  {
    "betsValue": 18057530000000,
    "winsValue": 14551360000000,
    "bets": 6104,
    "wins": 2459,
    "maxBet": 3010000000,
    "maxWin": 6020000000,
    "firstBetTimestamp": 1667000862,
    "lastBetTimestamp": 1667004763,
    "address": "EQCztAMYomEAUAadH4X-Vz0oygMIPvvxYJOoxUQkpLqpsrji",
    "profit": -3506170000000
  }
]
```

## GET `/player/:address`

```shell
curl -s https://parser.tonbot.fun/player/EQDGWh3jrNsAMChz0Xt7gS3MSaW6A-nXpjRMw8Jq3Whoj2hB | jq
```

- `address` - Address of player wallet contract

```json
{
  "player": {
    "betsValue": 2000000000,
    "winsValue": 4000000000,
    "bets": 2,
    "wins": 2,
    "maxBet": 1000000000,
    "maxWin": 2000000000,
    "firstBetTimestamp": 1667554204,
    "lastBetTimestamp": 1667554416,
    "address": "EQDGWh3jrNsAMChz0Xt7gS3MSaW6A-nXpjRMw8Jq3Whoj2hB",
    "profit": 2000000000
  },
  "bets": [
    {
      "lt": 32576847000001,
      "address": "EQDGWh3jrNsAMChz0Xt7gS3MSaW6A-nXpjRMw8Jq3Whoj2hB",
      "hash": "OR+lTLrucrNKSAif3cLf78jmppTyuybzMrLKdgk6/wk=",
      "time": 1667554204,
      "value": 1000000000,
      "version": "2",
      "win": true
    },
    {
      "lt": 32576914000001,
      "address": "EQDGWh3jrNsAMChz0Xt7gS3MSaW6A-nXpjRMw8Jq3Whoj2hB",
      "hash": "9Mzibp+9jEtrCp/A+9oW0N04QcYmud9GfJV69+y0qhg=",
      "time": 1667554416,
      "value": 1000000000,
      "version": "2",
      "win": true
    }
  ]
}
```

## GET `/bets`

Return bets in ordered by logical time. Use it if you want to just show bets. Response is not idempotent.

```shell
curl -s "https://parser.tonbot.fun/bets?offset=0&limit=2" | jq
```

- `offset` - Optional. Default is `0`
- `limit` - Optional. Default value and in `.env` file. Maximum value in `.env` file

```json
{
  "bets": [
    {
      "lt": 32403347000001,
      "address": "EQB9DjoKb6di-LGbXVWf5wq_jH5SE-lCx09fMcVmHQNtDqke",
      "hash": "moQRkHoqjMGm8ogcTD0FDS8LrMVBZx0xr2XrtjnU6AI=",
      "time": 1666997915,
      "value": 3500000000,
      "version": "2",
      "win": false
    },
    {
      "lt": 32404211000001,
      "address": "EQD2gw6aNFN3Dv61iM-zMhagsQJDj6ZdE0nVl21FFLXWkoXO",
      "hash": "bs5omURddLXSUqXCHYivpxZviKs+ze2KJhomGOGUvyM=",
      "time": 1667000771,
      "value": 1000000000,
      "version": "2",
      "win": true
    }
  ],
  "total": 14777
}
```

## GET `/bets/stream`

Return bets in ordered by parser. Use it if you want to process bets. Response is not idempotent.

```shell
curl -s "https://parser.tonbot.fun/bets/stream?offset=0&limit=2" | jq
```

- `offset` - Optional. Default is `0`
- `limit` - Optional. Default value and in `.env` file. Maximum value in `.env` file

```json
{
  "bets": [
    {
      "lt": 32403347000001,
      "address": "EQB9DjoKb6di-LGbXVWf5wq_jH5SE-lCx09fMcVmHQNtDqke",
      "hash": "moQRkHoqjMGm8ogcTD0FDS8LrMVBZx0xr2XrtjnU6AI=",
      "time": 1666997915,
      "value": 3500000000,
      "version": "2",
      "win": false
    },
    {
      "lt": 32404211000001,
      "address": "EQD2gw6aNFN3Dv61iM-zMhagsQJDj6ZdE0nVl21FFLXWkoXO",
      "hash": "bs5omURddLXSUqXCHYivpxZviKs+ze2KJhomGOGUvyM=",
      "time": 1667000771,
      "value": 1000000000,
      "version": "2",
      "win": true
    }
  ],
  "total": 14777
}
```

## GET `/bets/total`

```shell
curl -s https://parser.tonbot.fun/bets/total | jq
```

```json
{
  "total": 14777
}
```
