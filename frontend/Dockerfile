FROM node:21-alpine3.17

WORKDIR /app

COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/
COPY vite.config.js /app/
COPY index.html /app/

RUN npm i --force
RUN npm i -g serve

RUN npm run build

EXPOSE 5173 

CMD ["serve", "-s", "dist", "-l", "5173"]
