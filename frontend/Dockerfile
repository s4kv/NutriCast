FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN <<EOF 
npm install 
npm install -g expo-cli@6.0.0
EOF

COPY . .

EXPOSE 8081 19000 19001 19002

CMD ["npx", "expo", "start"]
