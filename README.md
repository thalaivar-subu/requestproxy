# requestproxy
Request Proxy Service that acts like a typical proxy to replay an HTTPS request to specified URL and returns back the response.


# Repo Setup
- Install Node v12.9.1 and Redis in your linux.
- Run npm install in your terminal after going to the repo directory
- Run npm run start-dev in your terminal and visit http://localhost:8080/
- You will recieve a status of 200 and message 'I am alive'
- Run npm test in your terminal and check logs -> this will trigger the unit test cases

# Repo Architecture
- `__tests__` -> will contain unit test cases
- `app` -> Application Code exists here
- `app/routes` -> will contain Rest API Routes and their respective logic
- `app/utils` -> will have utility functions and utilities like logger, redis , etc
- `build` -> will contain the final builded application
- `Dockerfile` -> Contains Dockerfile configurations
- `.prettier*` -> Files Contains Prettier Configurations
- `.eslint*` -> Files Contains Eslint Configurations
- `babel*` -> File contains Babel Configurations
- `jest.config.js` -> Contains Jest Configurations
= `app/lib/` -> contains constants and libraries, etc

# Docker Deploy
## Skip Redis steps if you have redis host already
- `sudo docker run --name local-redis -d redis` - creates a redis docker
- `sudo docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' dba3abe6d9b1` -> will return the IP of the Redis - dba3abe6d9b1 is the container name
## App Deploy
- Set the hostname of the Redis in Dockerfile
- `sudo docker build -t subramanian/requestproxy .` -> build docker image
- `sudo docker run -p 8080:8080 -d subramanian/requestproxy` -> Run/Deploy the docker image
- Hit `http://0.0.0.0:8080/` -> you will recieve a response
