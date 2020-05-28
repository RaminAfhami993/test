FROM node:12.13.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5750

CMD ["npm", "start"]