FROM node:16

# Create app directory
WORKDIR /usr/scr/app

# Install app dependencies

COPY package*.json ./

RUN npm Install

# Bundle app source
COPY . .

EXPOSE 8080
CMD ["node", "server.js"]