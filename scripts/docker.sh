// Build the backend app container
docker build \
    -t feedback-app:v4.0 \
    -t feedback-app:latest \
    -t asadulhaque90/feedback-app:v4.0 \
    -t asadulhaque90/feedback-app:latest .

# Create a docker network for the app
docker network create feedback-app-nw

# Run the postgres database container
docker run \
    --name postgres-db \
    --network feedback-app-nw \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=password \
    -e POSTGRES_DB=feedbackdb \
    -v feedback-app-data:/var/lib/postgresql/data \
    -d \
    --rm \
    postgres

# Run the backend app container
docker run \
    --name feedback-app \
    --network feedback-app-nw \
    -p 3030:3000 \
    -e DB_USER=postgres \
    -e DB_HOST=postgres-db \
    -e DB_NAME=feedbackdb \
    -e DB_PASSWORD=password \
    -e DB_PORT=5432 \
    -d \
    --rm \
    feedback-app

# Stop the containers
docker stop feedback-app postgres-db

# Remove the containers
docker rm feedback-app postgres-db


#ENV DB_USER=postgres
#ENV DB_HOST=postgres-db
#ENV DB_NAME=feedbackdb
#ENV DB_PASSWORD=password
#ENV DB_PORT=5432