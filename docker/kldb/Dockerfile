FROM mongo


# Copy the script that sets up a Mongo db, user and password
# to a standard location inside the Mongo image.
COPY docker/kldb/db_init.js /docker-entrypoint-initdb.d/
