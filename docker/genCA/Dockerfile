FROM ubuntu:xenial

#  genca is for 'generate CA', a DIY certificate authority.

# Install SSL and generate a certificate.
# To install this certificate into the iOS simulator so it's trusted:

# Copy the root CA out of the container with these commands:

# $ id=$(docker create knightlife-api_klapi:latest)
# $ docker cp $id:/home/node/rootCA.key ~/ssl
# $ docker cp $id:/home/node/rootCA.cer ~/ssl
# $ docker rm -v $id

# Drag the rootCA.cer file onto the simulator,
# Go to  Settings > About > Certificate Trust Settings and install.
# You may need to revisit that page to turn trusting 'Self CA' back on.

WORKDIR /tmp
RUN apt-get update
RUN apt-get install -y openssl

# Create a private key for the root certificate
RUN openssl genrsa -out rootCA.key 2048

#Then create the root self-signed certificate:
RUN openssl req -x509 -sha256 -new -key rootCA.key -out rootCA.cer -days 730 -subj /CN="Self CA"