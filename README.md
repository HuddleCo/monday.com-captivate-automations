# Monday.com Captivate Automations

Automations for the processing of epsiodes for Captivate.ai. The automations are triggered by webhooks from Monday.com as [Custom Triggers](https://monday.com/developers/apps/custom-trigger).

This application extends the [Quickstart Integration](https://github.com/mondaycom/welcome-apps/tree/master/apps/quickstart-integrations) example application avaliable on [Monday.com developers](https://monday.com/developers/apps/intro) page, which utilises the [Monday.com SDK](https://github.com/mondaycom/monday-sdk-js#mondaycom-apps-framework-sdk-for-javascript) and [GraghQL API](https://monday-api.readme.io/docs).

The application is containerised in a Docker image [aussidavid/captivate-ingrations](https://hub.docker.com/r/aussidavid/captivate-ingrations) is available on Docker Hub.

## Usage

    git clone https://github.com/aussiDavid/monday.com-captivate-automations.git
    cd monday.com-captivate-automations
    npm install
    npm run prepare
    cp -v .env.example .env

Please update the `.env` with missing environment variables.

| Environment Variable  | Description                                                                                             |
| --------------------- | :------------------------------------------------------------------------------------------------------ |
| MONDAY_SIGNING_SECRET | Signing Secret located on the Developers page in your Monday.com app                                    |
| SENTRY_DNS            | Token for error reporting with [Sentry.io](https://docs.sentry.io/product/sentry-basics/dsn-explainer/) |
| TOKEN_OVERRIDE        | (optional) The API token used when making API requests to make development easier                       |
| PORT                  | (optional) Specify the port number for the web app. Defaults to port 80                                 |

    npm start

    Version: 3.0.0
    Environment: development
    Listening: http://localhost:8302

## Deployment

The application is best deployed as a docker container.

    docker run --rm \
      -e NODE_ENV=production \
      -e MONDAY_SIGNING_SECRET=SECRET \
      -e SENTRY_DNS=TOKEN \
      -p 80:80 \
      aussidavid/captivate-ingrations

Where applicable, it is recommended to run the container as a service on a docker swarm to ensure the app is always running.

    docker service create -e NODE_ENV=production \
      -e MONDAY_SIGNING_SECRET=SECRET \
      -e SENTRY_DNS=TOKEN \
      -p 80:80 \
      aussidavid/captivate-ingrations

_Note:_ Due to critical sections in the application, it is not recommended to run more than 1 replica as it may cause unexpected behaviour.

The application will need to be published on 1 port which can be specified by the `PORT` environment variable. The default port is 80.

The application will need to be accessible to [Monday.com outgoing IP Addresses](https://support.monday.com/hc/en-us/articles/360012300479-About-monday-com-s-public-IP-addresses) as documented. This can be an extra precautionary measure determined by the deployer as the application already requies a vendor key on all requests. Allowing public access to the application _should_ be safe, but use your judgement depending on your infrastructure setup.

All outgoing traffic from the application should be allowed.

## License

UNLICENSED
