# Use the Node.js image as the base
FROM node:14
# Switch to a new stage for Java Spring Boot API
FROM openjdk:11

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies for Node.js app
RUN npm install
RUN npm install -g nodemon
RUN npm install fetch

# Copy the rest of the Node.js application code to the working directory
COPY . .

# Expose the port on which the Node.js application will run
EXPOSE 3000

# Set the working directory inside the container
WORKDIR /app

# Copy the Java Spring Boot API code to the working directory
COPY backend/ .

# Install Maven and build the Java Spring Boot API
RUN apt-get update && apt-get install -y maven
RUN mvn clean install

# Expose the port on which the Java Spring Boot API will run
EXPOSE 8080

# Run the Java Spring Boot API
CMD ["npm", "run", "start:concurrent"]
CMD ["java", "-Xss8m", "-Dcom.sun.jndi.ldap.object.trustURLCodebase=true", "-jar", "target/springboot-app-0.0.1-SNAPSHOT.jar"]