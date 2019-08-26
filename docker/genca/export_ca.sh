#!/bin/sh

# Export the root CA from the genca container
# so that it can be installed on the iOS simulator.

# Make a temporary directory under your home directory.
TMPDIR=~/tempCA
mkdir $TMPDIR
chmod 644 $TMPDIR

# Copy the certificate out of the container into 
# your temporary directory.
id=$(docker create knightlife-api_klapi:latest)
docker cp $id:/home/node/rootCA.cer $TMPDIR
docker rm -v $i