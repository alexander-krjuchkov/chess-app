# Keycloak local development setup

To use Keycloak for the first time, you need to initially set up its admin panel.

**Important:** These instructions are for local development. Production setup differs - see [./production-setup.md](./production-setup.md).

### 1. Access admin console

- Open Keycloak Admin Console at `http://localhost:8080/admin`
- Use development credentials: `admin` / `admin`

### 2. Create a development realm

- Click the realm selection block and then click `Create Realm`.
- Fill in the fields:
  - `Realm name`: `my-realm`

### 3. Create a frontend client

In the `my-realm` realm:
- Click `Clients` in the menu
- Click `Create client`
- Configure:
  - General settings:
    - `Client ID`: `my-app-frontend`
  - Capability config  
    Keep the default settings:  
    - `Client authentication` remains `Off` (default) since this is a public client.  
    - `Standard flow` (enabled by default) enables the OIDC Authorization Code Flow.
  - Login settings:
    - `Root URL`: `http://localhost:5173`
    - `Valid redirect URIs`: `http://localhost:5173/auth-callback`
    - `Valid post logout redirect URIs`: `http://localhost:5173/`
    - `Web origins`: `http://localhost:5173`
- Click `Save`

### 4. Enable PKCE

Advanced settings appear after creating a client.

- Open the `Advanced` tab
- Enable PKCE by setting:
  - `Proof Key for Code Exchange Code Challenge Method`: `S256`
- Click `Save`

### 5. Add a protocol mapper

To ensure proper audience verification (the `aud` claim in tokens includes the Client ID):

- In the client settings, navigate to the `Client Scopes` tab.
- Open `my-app-frontend-dedicated`.
- In the `Mappers` tab, click `Configure a new mapper`.
- Choose mapper type: `Audience`.
- Configure:
  - `Name`: `audience-mapper`
  - `Included Client Audience`: `my-app-frontend`
  - `Add to access token`: `On` (enabled by default)
- Save.

### 6. Enable user registration

In the `my-realm` realm:
- Go to `Realm settings` section
- In the `Login` tab, enable:
  - `User registration`: `On`  
  (allows user self-registration)

### 7. Create a test user

In the `my-realm` realm:

- Navigate to `Users`
- Click `Create new user`
- Configure:
  - `Username`: `testuser`
  - `Email`: `test@example.com`
  - `Email verified`: `On`
- Click `Save`
- Go to the `Credentials` tab
- Click `Set Password`:
  - `Password`: [enter password]
  - `Password confirmation`: [re-enter password]
  - `Temporary`: `Off`
- Click `Save`
- Confirm by clicking `Save password`
