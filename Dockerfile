FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Set environment variable for React development server binding
ENV HOST 0.0.0.0

EXPOSE 3000

CMD ["npm", "start"]
