FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 3000

RUN apt-get update && apt-get install -y git

CMD ["npm", "run", "dev"]