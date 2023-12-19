# Deploying educates-backstage-app to Kubernetes

## Build the container image

```
yarn install --frozen-lockfile
yarn tsc  # This might fail if code checking fails.
# Build the dist packages
yarn build:backend
# Build the container image
docker image build . -f packages/backend/Dockerfile --tag educates-backstage:0.0.1
```

## Create backstage namespace

```
kubectl create ns backstage
```

## Deploy backstage

**Edit your `my-values.yaml` following the schema.**

```
ytt --data-values-file my-values.yaml -f bundle | kapp deploy -a educates-backstage -n default -c -f - -y
```

**NOTE**: Image used will need to be on a container registry
If using kind, you can do `kind load docker-image educates-backstage:0.0.1 --name <KIND_CLUSTER_NAME>`

## Test

```
docker buildx build --platform linux/amd64,linux/arm64 -t "jorgemoralespou/bstg:devel" . -f packages/backend/Dockerfile --push
ytt --data-values-file kubernetes/my-values.yaml -f kubernetes/bundle | kbld -f - | kapp deploy -a educates-backstage -n default -c -f - -y
```

## Delete

```
kapp delete -a educates-backstage -n default -y
```
