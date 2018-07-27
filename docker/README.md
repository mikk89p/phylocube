# Docker Container
## Backend node.js application
Docker allows to package an application with all its dependencies into a standardized unit, called Docker container. A container is a small version of a linux OS.

Build backend applications
<code>cd backend-docker</code>
<code>docker build -t phylocube-backend-app .</code>

Running Docker container in detached mode (-d) - container runs in the background<br>
The -p flag redirects a public port to a private port inside Docker container
<code>docker run -p 3000:3000 -d phylocube-backend-app</code>
<code>docker run -p 3001:3000 -d phylocube-backend-app</code>

## NGINX Reverse Proxy
Build one frontend / nginx application
<code>cd nginx-docker</code>
<code>docker build -t phylocube-nginx-app .</code>
<code>docker run -p 80:80 -d phylocube-nginx-app</code>