# Chess application frontend

Developed with React and TypeScript using the [Vite](https://vite.dev/) build tool.

## Development environment setup

You have 2 options to start development mode

### Option 1: All-in-one dev script

Run a special development script as described in [../README.md](../README.md#option-1-all-in-one-dev-script).

Requires **Linux** with **Docker** installed.

### Option 2: Running services individually

Set up and run services individually.

Requires **Node.js** to be installed.

You will also need **Docker** installed to run dependent services.

#### Install project dependencies

Install the project dependencies if not already installed:

```sh
npm i
```

#### Start dependent services

To get started, you need to start dependent services.

Start the backend as described in [../backend/README.md](../backend/README.md#development-environment-setup).

Don't forget to shut down dependent services after finishing your work.

#### Run development server

To start the development server, run:

```sh
npm run dev
```

## Make necessary changes

Make the necessary modifications.

Here are some useful commands (Node.js is required).

### Code style

To check and fix formatting errors and style issues in your code, run the linter with the following command:

```sh
npm run lint
```

## Finish developing

Stop the project and terminate dependent services.
