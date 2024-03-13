FROM node:20.9.0-slim

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./

RUN npm config set registry http://registry.npmjs.org

RUN npm install

COPY ./src ./src
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
