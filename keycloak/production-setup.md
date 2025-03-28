# Keycloak production setup

This project relies on an authorization provider, so a deployed authorization provider is required for the production environment.

This project was developed and tested with Keycloak v26 using a specific set of configurations. The most significant configuration aspects are described in this document.

In general, the project assumes an authorization provider that implements OpenID Connect (OIDC) 1.0 with the `Authorization Code Flow` and the `PKCE` (Proof Key for Code Exchange) extension for public clients (without a secret key).  
The application expects access tokens in JWT format, where the `aud` (audience) field includes the Client ID value, and the payload contains the fields `sub`, `email`, `email_verified`, and `preferred_username`.

*Note:* Although the OIDC standard does not require (nor forbid) including user data directly in the access token, Keycloak does this by default, which helps avoid making additional requests to the UserInfo endpoint or processing the ID token on the backend.

## Recommendations for deploying Keycloak

A production-mode Keycloak v26 deployment is required.

Follow the general guidelines for deploying Keycloak in production. Here are a few recommendations:
- Run Keycloak in production mode.
- Ensure that the authorization provider is only accessible via HTTPS.
- Use a reliable database for data storage and configure backups.
- Enable PKCE (Proof Key for Code Exchange), as the project relies on it.

You can find the complete list of recommendations in the documentation.

Here are some useful links:
- [Server sizing recommendations](https://www.keycloak.org/high-availability/concepts-memory-and-cpu-sizing) - guidelines for CPU and memory.
- [Production deployment of Keycloak](https://www.keycloak.org/server/configuration-production) - general configuration settings.
- [Keycloak guides](https://www.keycloak.org/guides) - introductory materials.
- [Keycloak documentation](https://www.keycloak.org/documentation) - the full reference guide.

## Configuring the Keycloak administration console

Below is the process for configuring the Keycloak admin console, including settings specific to the current project.

Navigate to `https://auth.example.com/admin` and log in as an administrator.

*Note:* In the current documentation, the domain `auth.example.com` is used as an example; replace it with your actual domain throughout the documentation.

### Creating a realm

First, create your own realm.

*Note:* Although the `master` realm already exists by default, the documentation recommends using it only for administering Keycloak itself. For all other applications, you should create a separate realm.

- Click the realm selection block and then click `Create Realm`.
- Fill in the fields:
  - `Realm name`: `my-realm`

*Note:* In this documentation, the trivial name `my-realm` is used as an example; however, you should choose a meaningful name and consistently replace the string `my-realm` with your selected name throughout the documentation.

### Creating a client

Within your realm, create a client:
- Click `Clients` in the menu
- Click `Create client`
- Configure:
  - General settings:
    - `Client ID`: `my-app-frontend`

    *Note:* For this example, the trivial Client ID `my-app-frontend` is used. However, you should choose a proper, meaningful name and replace `my-app-frontend` with your chosen Client ID throughout the documentation.

  - Login settings:
    - `Root URL`: `https://auth.example.com`
    - `Valid redirect URIs`: `https://auth.example.com/auth-callback`
    - `Valid post logout redirect URIs`: `https://auth.example.com/`
    - `Web origins`: `https://auth.example.com`

  *Note:* When creating the client, you can leave the other settings at their default values. For example, the `Client authentication` setting is `off` by default, since the frontend client uses public access type rather than confidential access type. Also, the enabled option `Standard flow` under the `Authentication flow` (enabled by default) activates the standard OIDC "Authorization Code Flow" for this client.
- Click `Save`

### Enabling PKCE

- After saving the client, navigate to the `Advanced` tab.
- Set `Proof Key for Code Exchange Code Challenge Method` to `S256`.
- Save.

### Adding a protocol mapper for the audience

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

### Configuring user registration

In the `Realm settings` > `Login`, enable:

- `User registration` - allows users to self-register.
- `Forgot password` - enables password recovery.
- `Remember me` - shows "Remember me" checkbox on login page.
- `Verify email` - requires email verification.

### Configuring SMTP

To send email notifications, configure SMTP under `Realm settings` > `Email`. See the [Keycloak documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#_email) for details.

### Bot protection

Optionally, you can implement bot protection during user registration, for example by setting up a CAPTCHA.

Keycloak supports Google reCAPTCHA integration for registration (see [Enabling reCAPTCHA](https://www.keycloak.org/docs/latest/server_admin/index.html#proc-enabling-recaptcha_server_administration_guide)).

*Note:* Integration with an external service is required (you will need to obtain keys from Google reCAPTCHA).
