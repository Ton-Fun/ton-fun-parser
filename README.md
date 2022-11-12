# Ton fun parser
## Up local for development
```shell
yarn install
cp .env.local .env
yarn start
```

## Up local using docker compose
[Up infrastructure](https://github.com/kokkekpek/ton-fun-infrastructure)
```shell
docker compose --env-file .env.local up
```

## Deploy on server
Auto [GitHub action](https://github.com/kokkekpek/ton-fun-parser/actions/workflows/deploy.yml)