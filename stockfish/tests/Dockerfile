FROM node:23.5.0-alpine3.20

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENTRYPOINT ["npm", "test"]
