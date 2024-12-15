FROM node:21-alpine3.17

WORKDIR /app

COPY package.json /app/
RUN npm i 

COPY swagger.yaml /app/
copy server.js /app/
COPY config/ /app/config/
COPY models/ /app/models/
COPY routes/ /app/routes/
COPY middlewares/ /app/middlewares/
COPY .env /app

EXPOSE 8000

CMD ["npm", "run", "start"]