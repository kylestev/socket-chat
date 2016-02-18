FROM risingstack/alpine:3.3-v5.6.0-3.0.0

COPY package.json package.json

RUN NODE_ENV=notprod npm install

COPY .babelrc .babelrc
COPY .env .env
COPY .eslintrc .eslintrc
COPY config config
COPY src src

ENV REDIS_HOST redis
ENV DEBUG server

CMD ["npm", "run", "serve"]
