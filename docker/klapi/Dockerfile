# Specify genca as a previous build stage.
FROM genca as ca

# Specify the node base image (verison 10)
FROM node:10

# Copy in the rootCA files from the genca image
WORKDIR /home/node 
COPY --from=ca /tmp/rootCA.key /home/node 
COPY --from=ca /tmp/rootCA.cer /home/node

# Make a certificate and get it signed against our own Self CA.
RUN openssl genrsa -out localhost.key 2048
RUN openssl req -new -out localhost_cert.req -key localhost.key -subj /CN=localhost
RUN openssl x509 -req -sha256 -in localhost_cert.req -out localhost.cer -CAkey rootCA.key -CA rootCA.cer -days 365 -CAcreateserial -CAserial serial


# Copy in the source code for the API and install it.
WORKDIR /usr/src/app
COPY . .
RUN npm install

# Set the DEBUG environment variable.
ENV DEBUG=express:*

# Run the API server.
CMD node index.js

