FROM node:21-alpine3.17

COPY package.json .
RUN npm i 

copy server.js .
COPY config/ config/
COPY routes/ routes/
COPY middlewares/ middlewares/

EXPOSE 8000

CMD ["npm", "run", "start"]