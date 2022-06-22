FROM node:16.15.1

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package.json .

RUN npm i

COPY ./ .

EXPOSE 3030

RUN npm run build

CMD ["npm", "start"]
