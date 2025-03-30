# Docker image for chess engine

This project uses Stockfish as a chess engine. In this project, it is containerized and tested with an HTTP interface developed for the project.

## Getting started

### Preparation

1. **Build the image:**

    ```
    docker build --tag engine-image ./service
    ```

2. **(Optional) View the image size:**

    ```
    docker inspect -f "{{ .Size }}" engine-image | numfmt --to=iec-i
    ```

    *(See [this gist](https://gist.github.com/MichaelSimons/fb588539dcefd9b5fdf45ba04c302db6) for more details.)*

### Interaction

You can choose one of the following options.

#### Run for local development of other services

1. **Run new container:**

    ```
    docker run --rm -d -p 5000:5000 --name engine-container engine-image
    ```

2. **Develop other services**

    Develop other services using this one

3. **Stop the running container:**

    ❗ **_Don't forget to stop the container_**

    ```
    docker stop engine-container
    ```

#### Explore the engine inside the running container

1. **Run new container:**

    ```
    docker run --rm -d --name engine-container engine-image
    ```

2. **Enter stockfish interface:**

    ```
    docker exec -it engine-container stockfish
    ```

3. **Try these commands:**

    ```
    > uci
    > isready
    > position startpos
    > go depth 1
    ```

    For more information on commands, see the [Stockfish UCI & Commands wiki](https://github.com/official-stockfish/Stockfish/wiki/UCI-&-Commands)

4. **Exit stockfish interface:**

    ```
    > quit
    ```

5. **Stop the running container:**

    ❗ **_Don't forget to stop the container_**

    ```
    docker stop engine-container
    ```

#### Experience the http interface for getting the best move locally

1. **Run new container:**

    ```
    docker run --rm -d -p 5000:5000 --name engine-container engine-image
    ```

2. **Send requests to the interface**

    Request example:

    ```
    curl -X POST http://localhost:5000/best-move -H "Content-Type: application/json" -d '{"fen": "rnbqkb1r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}'
    ```

3. **Stop the running container:**

    ❗ **_Don't forget to stop the container_**

    ```
    docker stop engine-container
    ```

#### Develop the HTTP interface locally

1. **Change directory:**

    ```
    cd ./service
    ```

2. **Run new container:**

    ```
    docker run --rm -d --name engine-container engine-image
    ```

3. **Install service directory dependencies:**

    ```
    npm i
    ```

3. **Start http server:**

    ```
    ENGINE_CMD='["docker", "exec", "-i", "engine-container", "stockfish"]' \
      npm run dev
    ```

4. **Send request to the interface:**

    ```
    curl -X POST http://localhost:5000/best-move -H "Content-Type: application/json" -d '{"fen": "rnbqkb1r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}'
    ```

5. **Stop the running container:**

    ❗ **_Don't forget to stop the container_**

    ```
    docker stop engine-container
    ```

#### Run image integration tests

```
./test.sh
```

#### Develop integration tests locally

* **Setup**

    1. **Change directory:**

        ```
        cd ./tests
        ```

    2. **Install test directory dependencies:**

        ```
        npm i
        ```

* **Develop**

    * **Main suite**

        1. **Run new container:**

            ```
            docker run --rm -d -p 5000:5000 --name engine-container engine-image
            ```

        2. **Run tests:**

            ```
            API_URL='http://localhost:5000/best-move' \
              npm run test -- integration.main.test.js
            ```

        3. **Stop the running container:**

            ❗ **_Don't forget to stop the container_**

            ```
            docker stop engine-container
            ```

    * **Timeout suite**

        1. **Run new container:**

            ```
            docker run --rm -d -p 5000:5000 --env-file ./config/.env.timeout --name engine-container engine-image
            ```

        2. **Run tests:**

            ```
            API_URL='http://localhost:5000/best-move' \
              npm run test -- integration.timeout.test.js
            ```

        3. **Stop the running container:**

            ❗ **_Don't forget to stop the container_**

            ```
            docker stop engine-container
            ```

### Post-interaction

1. **Remove the built image:**

    ```
    docker rmi engine-image
    ```

## Environment variables

The following environment variables can be optionally set

* `PORT` - http server port. Default is 5000.

* `DEFAULT_TIMEOUT` - default request timeout if not specified in the request. Integer milliseconds. Default is 2000.

* `MAX_TIMEOUT` - request execution time limit, which limits the timeout specified in the request. Integer milliseconds. Default is 30000.

* `DEFAULT_DEPTH` - engine search depth if not specified in the request. Default is 1.

* `ENGINE_CMD` - engine launch command. JSON with an array of strings, where the first element is the executable, the following elements are command arguments passed to the executable. Default is `["stockfish"]`.

## Request structure

Request must be in json format

**Required fields**:

* `fen` - position on the board in Forsyth–Edwards Notation (FEN).

**Optional fields**:

* `depth` - engine search depth, positive integer. Default value is taken from environment variables.

* `timeout` - request timeout, integer milliseconds. Default value is taken from environment variables.

## Response structure

If successful, the server will respond with http status 200 and json with `bestMove` field, which contains the best next move string like `e2e4` or `(none)` if there is none.

In case of user data error, the status will be 400 and json with an error description.

In case of server-side error, the status will be 500 and json with an error description.
