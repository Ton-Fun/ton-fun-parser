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

## [API](API.md)