# Ton fun parser
## Up for development
### Install
```shell
yarn install && yarn env
```

```shell
docker compose -f docker-compose.local.yaml --env-file .env.local up
```

### Start
```shell
yarn start
```

## Up local using [docker image from GitHub](https://github.com/kokkekpek/ton-fun-parser/pkgs/container/ton-fun-parser)
[Up infrastructure](https://github.com/kokkekpek/ton-fun-infrastructure#readme)
```shell
docker compose --env-file .env.local up
```

## Deploy on server
Auto [GitHub action](https://github.com/kokkekpek/ton-fun-parser/actions/workflows/deploy.yml)

Secrets
* `SSH_DEPLOY_PRIVATE_KEY`
* `MONGO_INITDB_ROOT_PASSWORD`

## API
### GET `/health`
```shell
curl -s https://tonbot.fun/health | jq
```
```json
{
  "success": "OK"
}
```

### GET `/state`
```shell
curl -s https://tonbot.fun/state | jq
```
```json
{
  "state": {
    "_id": "6370e78d72aa6709889ba007",
    "maxHash": "4TRcUKLP3dDjCGfwn/PVZZSUajQRKUJJyjJHlSQo6uE=",
    "maxLt": "32823186000001",
    "parseHash": "",
    "parserLt": "0",
    "parserTargetHash": "4TRcUKLP3dDjCGfwn/PVZZSUajQRKUJJyjJHlSQo6uE=",
    "parserTargetLt": "32823186000001"
  },
  "scraped": 7680
}
```

### GET `/bets?offset=<offset>&limit=<limit>`
```shell
curl -s "http://localhost:3000/bets?offset=0&limit=2" | jq
```
```json
{
  "bets": [
    {
      "_id": "6370e82f72aa6709889be224",
      "lt": "32403347000001",
      "address": "EQB9DjoKb6di-LGbXVWf5wq_jH5SE-lCx09fMcVmHQNtDqke",
      "hash": "moQRkHoqjMGm8ogcTD0FDS8LrMVBZx0xr2XrtjnU6AI=",
      "time": 1666997915,
      "value": "3500000000",
      "win": false
    },
    {
      "_id": "6370e82f72aa6709889be222",
      "lt": "32404211000001",
      "address": "EQD2gw6aNFN3Dv61iM-zMhagsQJDj6ZdE0nVl21FFLXWkoXO",
      "hash": "bs5omURddLXSUqXCHYivpxZviKs+ze2KJhomGOGUvyM=",
      "time": 1667000771,
      "value": "1000000000",
      "win": true
    }
  ],
  "total": 7680
}
```

### GET `/bets/total`
```shell
curl -s https://tonbot.fun/bets/total | jq
```
```json
{
  "total": 7680
}
```