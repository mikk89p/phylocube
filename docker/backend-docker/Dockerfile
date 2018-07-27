# Minimal Node.js Docker Images alpine
FROM node:10.7.0-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Rather than copying the entire working directory we are only copying the package.json and bundles.
# This allows us to take advantage of cached Docker layers
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .


# Expose port 3000
EXPOSE 3000

# Excecutes start command in package.json CMD 
CMD [ "npm", "start" ]