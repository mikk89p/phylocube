# Minimal Node 8 LTS Docker Images alpine
FROM node:8.11.3-alpine

# Create app directory
WORKDIR /app

# Rather than copying the entire working directory we are only copying the package.json and bundles.
# This allows us to take advantage of cached Docker layers
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port 8080
EXPOSE 80

# Excecutes start command in package.json CMD 
CMD [ "npm", "start" ]