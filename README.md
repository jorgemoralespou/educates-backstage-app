# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

To start the app, run:

```sh
yarn install
yarn dev
```

## Developing on educates (on Kind)

This command will build the backstage image, will push it to the local educates registry and then deploy to the educates kind cluster
using kapp. **NOTE** You only need to tweak the `my-values.yaml` file.

Build:

```
yarn install --frozen-lockfile
yarn tsc  # This might fail if code checking fails.
# Build the dist packages
yarn build:backend
```

Deploy:

```
ytt --data-values-file my-values.yaml -f kubernetes --ignore-unknown-comments | kbld -f - | kapp deploy -a educates-backstage -n default -c -f - -y
```
