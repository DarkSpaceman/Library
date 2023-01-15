FROM node:18.12.1

WORKDIR /counter

ARG NODE_EVN=production
COPY ./package*.json ./
RUN npm install
COPY src ./src

CMD [ "npm", "run", "start" ]