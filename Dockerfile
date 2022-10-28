FROM  node:lts-alpine

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app

COPY --chown=node:node package*.json ./

COPY client/package*.json client/
RUN npm run install-client --only=production


COPY --chown=node:node api/package*.json api/
RUN npm run install-api --only=production



COPY client/ client/
RUN npm run client-build --prefix client


COPY COPY --chown=node:node api/ api/



USER node

CMD [ "npm", "start", "--prefix", "api" ]



EXPOSE 5000