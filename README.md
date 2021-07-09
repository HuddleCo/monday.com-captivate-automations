# Monday.com Captivate Automations

Automations for the processing of epsiodes for Captivate.ai. The automations are triggered by webhooks from Monday.com by [Custom Triggers](https://monday.com/developers/apps/custom-trigger).

This application extends the [Quickstart Integration](https://github.com/mondaycom/welcome-apps/tree/master/apps/quickstart-integrations) example application avaliable on [Monday.com developers](https://monday.com/developers/apps/intro) page, which utilises the [Monday.com SDK](https://github.com/mondaycom/monday-sdk-js#mondaycom-apps-framework-sdk-for-javascript) and [GraghQL API](https://monday-api.readme.io/docs).

## Usage

    git clone https://github.com/aussiDavid/monday.com-captivate-automations.git
    cd monday.com-captivate-automations
    npm install
    npm run prepare
    cp -v .env.example .env

Please update the `.env` with missing environment variables.

| Environment Variable  |                                    Description                                    |
| --------------------- | :-------------------------------------------------------------------------------: |
| MONDAY_SIGNING_SECRET |       Signing Secret located on the Developers page in your Monday.com app        |
| TOKEN_OVERRIDE        | (optional) The API token used when making API requests to make development easier |
| PORT                  |     (optional) Specifty the port number for the web app. Defaults to port 80      |

    npm start

    Version: 2.1.3
    Environment: development
    Listening: http://localhost:8302

## Deployment

The application is best deployed as a docker container.

    docker run --rm \
      -e NODE_ENV=production \
      -e MONDAY_SIGNING_SECRET=SECRET \
      -p 80:80 \
      aussidavid/captivate-ingrations

Where applicable, it is recommended to run the container as a service on a docker swarm to ensure the app is always running.

    docker service create -e NODE_ENV=production \
      -e MONDAY_SIGNING_SECRET=SECRET \
      -p 80:80 \
      aussidavid/captivate-ingrations

_Note:_ Due to critical sections in the application, it is not recommended to run more than 1 replica as it may cause unexpected behaviour.

## License

UNLICENSED
