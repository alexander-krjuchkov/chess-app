# Chess application backend

The backend is built using the Node.js framework NestJS.

For more information about NestJS, please refer to the [NestJS Documentation](https://docs.nestjs.com).

## Project setup

1. Run chess engine http interface locally

    See [engine service README.md](../stockfish/README.md) to get it ready and running.

2. Install backend dependencies:

    ```bash
    npm i
    ```

## Environment variables

The following environment variables can be optionally set

* `PORT` - backend port. Default is 3000.

* `BEST_MOVE_URL` - URL of the best chess move calculation endpoint of the engine's HTTP interface. Default is `http://localhost:5000/best-move`.

## Development

To run in watch mode for development:

```bash
npm run start:dev
```

This command starts the development server with hot reloading.

To check and fix formatting errors and style issues in your code, run the linter with the following command:

```bash
npm run lint
```

## Run tests

For unit tests:

```bash
npm run test
```

For end-to-end tests:

```bash
npm run test:e2e
```
