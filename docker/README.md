# Docker Container
Docker allows to package an application with all its dependencies into a standardized unit, called Docker container. A container is a small version of a linux OS.

### Build backend node.js application
<code>cd backend-docker</code><br>
<code>docker build -t phylocube-backend-app .</code><br>

### Build nginx application
<code>cd nginx-docker</code><br>
<code>docker build -t phylocube-nginx-app .</code><br>

### Run whole stack
<code>docker stack deploy --compose-file stack.yml phylocube-stack</code><br>

### View stack
<code>docker stack services phylocube-stack</code><br>

### Stop stack
<code>sudo docker stack rm phylocube-stack</code><br

### Access services from docker ip
http://172.18.0.1/

### Access backend from docker ip
http://172.18.0.1/api/v1/

## Manual run
Running Docker container in detached mode (-d) - container runs in the background<br>
The -p flag redirects a public port to a private port inside Docker container<br>
<code>docker run -p 3000:3000 -d phylocube-backend-app</code><br>
<code>docker run -p 3001:3000 -d phylocube-backend-app</code><br>
<code>docker run -p 80:80 -d phylocube-nginx-app</code><br>

## Remove all images and Remove all containers
<code>docker rmi $(sudo docker images -q) -f</code><br>
<code>docker rm $(sudo docker ps -a -q) -f</code><br>

## No route to host fix
<code>noRouteToHostfix.sh</code><br>