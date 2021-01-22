FROM node:12

# Create app directory
WORKDIR /opt/requestproxy

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
ENV NODE_ENV development
ENV APP_NAME requestproxy
ENV PORT 8080

#Creating Redis Docker
# docker run --name local-redis -d redis

# redis host name from newly created redis docker
ENV REDIS_HOST 172.17.0.2 

# Bundle app source
COPY . .

EXPOSE 8080

RUN npm run build

CMD npm start

#build command
# sudo docker build -t subramanian/requestproxy .

#run command
# sudo docker run -p 8080:8080 -d subramanian/requestproxy
