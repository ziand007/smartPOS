FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]