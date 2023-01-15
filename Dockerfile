FROM node:18.12.1

WORKDIR /library

COPY ./package*.json ./
RUN npm install
COPY src ./src

CMD [ "npm", "run", "start" ]