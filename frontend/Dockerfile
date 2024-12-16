FROM node:21-alpine3.17

WORKDIR /app

COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/
COPY vite.config.js /app/

RUN npm i --force

CMD ["npm", "run", "dev"]
