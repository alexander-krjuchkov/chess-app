# Chess application backend

Built using the Node.js framework [NestJS](https://docs.nestjs.com).

## Environment variables

The following environment variables can be optionally set:
- `PORT` - backend port. Default is `3000`.
- `BEST_MOVE_URL` - URL of the best chess move calculation endpoint of the engine's HTTP interface. Default is `http://localhost:5000/best-move`.

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

To get started, first start the dependent services.

Requires Docker installed.

Go to the project root:
```sh
cd ..
```

Run
```sh
HOST_UID=$(id -u) HOST_GID=$(id -g) docker compose -f docker-compose.dev.yml up -d engine keycloak database adminer
```

**Important**: To use Keycloak for the first time, you need to initially configure its admin panel, see [../keycloak/dev-admin-setup.md](../keycloak/dev-admin-setup.md) for details.

Don't forget to shut them down after finishing your work:
```sh
HOST_UID=$(id -u) HOST_GID=$(id -g) docker compose -f docker-compose.dev.yml down
```

#### Run in watch mode

To start the development server with hot reloading, ensure you're in the backend directory and run:

```sh
npm run start:dev
```

## Make necessary changes

Make the necessary modifications.

Here are some useful commands (Node.js is required).

### Code style

To check and fix formatting errors and style issues in your code, run the linter with the following command:

```sh
npm run lint
```

### Run tests

For unit tests:

```sh
npm run test
```

For end-to-end tests:

```sh
npm run test:e2e
```

### Using TypeORM CLI

```sh
npm run typeorm -- <...>
```

Here are some examples:

#### Generating migrations

```sh
npm run typeorm -- migration:generate --pretty -d src/orm-data-source src/migration/update-post-table
```

**Shortcut**:

```sh
npm run typeorm:migration:generate -- src/migration/update-post-table
```

#### Run migrations

```sh
npm run typeorm -- migration:run -d src/orm-data-source
```

**Shortcut**:

```sh
npm run typeorm:migration:run
```

#### Revert last migration

```sh
npm run typeorm -- migration:revert -d src/orm-data-source
```

**Shortcut**:

```sh
npm run typeorm:migration:revert
```

#### TypeORM documentation

See [TypeORM](https://typeorm.io/) docs for more details:
- [Using CLI](https://typeorm.io/using-cli)
- [Migrations](https://typeorm.io/migrations)

## Finish developing

Stop the project and terminate dependent services.
