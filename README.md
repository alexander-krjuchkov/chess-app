# Chess web application

This is a web application that allows users to play chess against a computer.

## Getting started

## Production

To deploy to production, fork the repository, set up repository variables and secrets, and run the [main workflow](.github/workflows/main.yml).

### Repository variables

**All of the described repository variables are required.**

The following repository variables have been configured:

- **DOMAIN**: The domain where the application will be hosted. This will be used in the Caddy configuration.

In this project, GitHub deployment workflows use a container registry as an intermediate storage for built images.

- **CONTAINER_REGISTRY_HOST**: The host of the container registry being used. For the default Docker Hub, this is `docker.io`.

- **CONTAINER_REGISTRY_USERNAME**: Your username for the container registry.

- **ENGINE_IMAGE**: The application builds and uses multiple images. This variable is for the latest engine image. For example, `yourusername/chess-app:engine-latest`.

- **BACKEND_IMAGE**: This variable is for the latest backend image. For example, `yourusername/chess-app:backend-latest`.

- **FRONTEND_IMAGE**: This variable is for the latest frontend image. For example, `yourusername/chess-app:frontend-latest`.

### Repository secrets

**All of the described repository secrets are required.**

The following secrets have been added to the repository:

- **CONTAINER_REGISTRY_PASSWORD**: A token with write permissions for accessing the container registry.

SSH connection parameters to the server where the application will be deployed:

- **SSH_IP**: The IP address of the server.

- **SSH_USER**: The username for SSH access.

- **SSH_PRIVATE_KEY**: The private key for SSH access.

- **SSH_PUBLIC_KEY**: The public key for SSH access.

The SSH_PRIVATE_KEY and SSH_PUBLIC_KEY form a key pair that provides access to the server where the application will be deployed. For security reasons, this key pair should be created specifically for deployment purposes and should not be used for any other activities.

## Development

To get started, first clone the repository locally.

Second, set up your development environment. You can do this in two ways.

### Option 1: All-in-one dev script

For Linux with Docker installed, you can use the development script to launch all services in development mode with a single command:

```sh
./run-dev.sh
```

### Option 2: Running services individually

Requires Node.js installed.

For detailed setup and development instructions, follow service-specific guides:
- [Backend instructions](backend/README.md)
- [Frontend instructions](frontend/README.md)

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
