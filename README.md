# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

To start the app, run:

```sh
yarn install
yarn dev
```

## Get educates token in sample environment

```
kubectl apply -f sample-trainingportal.yaml

export EDUCATES_TOKEN=$(curl -s -X POST -d "grant_type=password&username=robot-user&password=top-secret" -u "application-id:top-secret" https://backstage-educates-plugin-ui.cluster-eu.spring-staging.academy/oauth2/token/ | jq -r ".access_token")

yarn dev
```
