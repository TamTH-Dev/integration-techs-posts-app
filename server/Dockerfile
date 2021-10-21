from node

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

USER node

CMD [ "node", "dist/index.js" ]
