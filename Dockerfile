FROM node:16.18.1
COPY . /app
WORKDIR /app
RUN yarn install
CMD ["yarn", "start"]