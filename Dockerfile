FROM node:8-alpine

ENV NODE_ENV production
ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./
COPY package-lock.json ./

USER node
RUN ls -al
RUN npm install --production

COPY --chown=node:node .next .next
COPY --chown=node:node public public

EXPOSE 3000

CMD npm start
