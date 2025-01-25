# Docker Image for Stockfish

## How to Use This Image

Follow these steps to build and run the Docker image:

1. **Build the Image:**

    ```
    docker build --tag stockfish-demo-image .
    ```

2. **(Optional) View the Image Size:**

    ```
    docker inspect -f "{{ .Size }}" stockfish-demo-image | numfmt --to=si
    ```

    *(See [this gist](https://gist.github.com/MichaelSimons/fb588539dcefd9b5fdf45ba04c302db6) for more details.)*

3. **Run a New Container:**

    ```
    docker run --rm -d --name stockfish-demo-container stockfish-demo-image
    ```

4. **Enter the Running Container:**

    ```
    docker exec -it stockfish-demo-container /bin/bash
    ```

5. **Test Stockfish Inside the Running Container:**

    Start Stockfish and use the following commands:

    ```
    stockfish
    > uci
    > isready
    > position startpos
    > go depth 1
    > quit
    ```

    *(For more information on commands, see the [Stockfish UCI & Commands wiki](https://github.com/official-stockfish/Stockfish/wiki/UCI-&-Commands).)*

6. **Stop the Running Container:**

    ```
    docker stop stockfish-demo-container
    ```

7. **Remove the Built Image:**

    ```
    docker rmi stockfish-demo-image
    ```
