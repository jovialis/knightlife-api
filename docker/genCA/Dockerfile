#  genca is for 'generate CA', a DIY certificate authority.

# Install SSL and generate a certificate.
# See "DEVELOPMENT ENVIRONMENT HOWTO" in README.
# to  install and trust this root certificate in the
# iOS simulator.

FROM ubuntu:xenial
WORKDIR /tmp
RUN apt-get update
RUN apt-get install -y openssl

# Create a private key for the root certificate
RUN openssl genrsa -out rootCA.key 2048

#Then create the root self-signed certificate:
RUN openssl req -x509 -sha256 -new -key rootCA.key -out rootCA.cer -days 730 -subj /CN="Self CA"
