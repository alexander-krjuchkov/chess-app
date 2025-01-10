# Chess web application

This is a web application that allows users to play chess against a computer.

## Getting started

To deploy the project to production, fork the repository, set up repository variables and secrets as described in the [GitHub actions](#github-actions) section, and run the [main workflow](.github/workflows/main.yml).

For development purposes, clone the repository locally and follow the setup instructions in the [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) files.

## GitHub actions

The project uses GitHub Actions to automate testing and deployment. For this purpose, repository variables and secrets have been added to the repository settings.

### Repository variables

**All of the described repository variables are required for production build and deploy.**

The following repository variables have been configured:

- **DOMAIN**: The domain where the application will be hosted. This will be used in the Caddy configuration.

In this project, GitHub deployment workflows use a container registry as an intermediate storage for built images.

- **CONTAINER_REGISTRY_HOST**: The host of the container registry being used. For the default Docker Hub, this is `docker.io`.

- **CONTAINER_REGISTRY_USERNAME**: Your username for the container registry.

- **BACKEND_IMAGE**: The application builds and uses multiple images. This variable is for the latest backend image. For example, `yourusername/chess-app:backend-latest`.

- **FRONTEND_IMAGE**: This variable is for the latest frontend image. For example, `yourusername/chess-app:frontend-latest`.

### Repository secrets

**All of the described repository secrets are required for production build and deploy.**

The following secrets have been added to the repository:

- **CONTAINER_REGISTRY_PASSWORD**: A token with write permissions for accessing the container registry.

SSH connection parameters to the server where the application will be deployed:

- **SSH_IP**: The IP address of the server.

- **SSH_USER**: The username for SSH access.

- **SSH_PRIVATE_KEY**: The private key for SSH access.

- **SSH_PUBLIC_KEY**: The public key for SSH access.

The SSH_PRIVATE_KEY and SSH_PUBLIC_KEY form a key pair that provides access to the server where the application will be deployed. For security reasons, this key pair should be created specifically for deployment purposes and should not be used for any other activities.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
