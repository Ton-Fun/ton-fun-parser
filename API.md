# API
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
{
    "state": {
        "_id": "6371c1645d9c48d28115aadc",
        "maxHash": "rTdmPuxq8q3HMon3rf3acikphIjsjKhojK7pQxiE4ys=",
        "maxLt": 32836213000001,
        "parseHash": "",
        "parserLt": 0,
        "parserTargetHash": "rTdmPuxq8q3HMon3rf3acikphIjsjKhojK7pQxiE4ys=",
        "parserTargetLt": 32836213000001
    },
    "scraped": 7725
}
```


## GET `/summary`
```shell
curl -s https://parser.tonbot.fun/state | jq
```

```json
{
    "players": 94,
    "betsValue": 30076828219605,
    "winsValue": 23964705221624,
    "bets": 7725,
    "wins": 3118,
    "maxBet": 800000000000,
    "maxWin": 1600000000000,
    "firstBetTimestamp": 1666997915,
    "lastBetTimestamp": 1668390910
}
```


## GET `/players?orderBy=<orderBy>&sort=<sort>`

* `orderBy` - Available values:
  * `betsValue`
  * `winsValue`
  * `bets`
  * `wins`
  * `maxBet`
  * `maxWin`
  * `firstBetTimestamp`
  * `lastBetTimestamp`
  * `profit`
* `sort` - Available values:
  * `asc`
  * `desc`

```shell
curl -s https://parser.tonbot.fun/players | jq
```

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

* `address` - address of player

```shell
curl -s https://parser.tonbot.fun/player/EQDGWh3jrNsAMChz0Xt7gS3MSaW6A-nXpjRMw8Jq3Whoj2hB | jq
```

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
      "lt": 32576914000001,
      "address": "EQDGWh3jrNsAMChz0Xt7gS3MSaW6A-nXpjRMw8Jq3Whoj2hB",
      "hash": "9Mzibp+9jEtrCp/A+9oW0N04QcYmud9GfJV69+y0qhg=",
      "time": 1667554416,
      "value": 1000000000,
      "win": true
    },
    {
      "lt": 32576847000001,
      "address": "EQDGWh3jrNsAMChz0Xt7gS3MSaW6A-nXpjRMw8Jq3Whoj2hB",
      "hash": "OR+lTLrucrNKSAif3cLf78jmppTyuybzMrLKdgk6/wk=",
      "time": 1667554204,
      "value": 1000000000,
      "win": true
    }
  ]
}
```


## GET `/bets?offset=<offset>&limit=<limit>`

* `offset` >= `0`
* `limit` from `1` to `1000` by default

```shell
curl -s "https://parser.tonbot.fun/bets?offset=0&limit=2" | jq
```

```json
{
  "bets": [
    {
      "_id": "6371c2335d9c48d28115e955",
      "lt": 32403347000001,
      "address": "EQB9DjoKb6di-LGbXVWf5wq_jH5SE-lCx09fMcVmHQNtDqke",
      "hash": "moQRkHoqjMGm8ogcTD0FDS8LrMVBZx0xr2XrtjnU6AI=",
      "time": 1666997915,
      "value": 3500000000,
      "win": false
    },
    {
      "_id": "6371c2335d9c48d28115e956",
      "lt": 32404211000001,
      "address": "EQD2gw6aNFN3Dv61iM-zMhagsQJDj6ZdE0nVl21FFLXWkoXO",
      "hash": "bs5omURddLXSUqXCHYivpxZviKs+ze2KJhomGOGUvyM=",
      "time": 1667000771,
      "value": 1000000000,
      "win": true
    }
  ],
  "total": 7726
}
```


## GET `/bets/total`
```shell
curl -s https://parser.tonbot.fun/bets/total | jq
```

```json
{
  "total": 7680
}
```