FROM  node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY client/package*.json client/
RUN npm run install-client --only=production


COPY api/package*.json api/
RUN npm run install-api --only=production

RUN chown -R node:node /app/images

COPY client/ client/
RUN npm run client-build --prefix client


COPY api/ api/



USER node

CMD [ "npm", "start", "--prefix", "api" ]



EXPOSE 5000