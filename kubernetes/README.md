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

## Test k8s APIs

```
# Check all possible clusters, as your .KUBECONFIG may have multiple contexts:
kubectl config view -o jsonpath='{"Cluster name\tServer\n"}{range .clusters[*]}{.name}{"\t"}{.cluster.server}{"\n"}{end}'

# Select name of cluster you want to interact with from above output:
export CLUSTER_NAME="educates-eks-develop-jorge"

# Point to the API server referring the cluster name
APISERVER=$(kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")

# Create a secret to hold a token for the default service account
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: default-token
  annotations:
    kubernetes.io/service-account.name: default
type: kubernetes.io/service-account-token
EOF

kubectl apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: backstage-token
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: default
  namespace: default
EOF

kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    cert-manager.io/cluster-issuer: wildcard
  name: kubernetes
  namespace: default
spec:
  rules:
  - host: kubernetes.cluster-eu.spring-staging.academy
    http:
      paths:
      - backend:
          service:
            name: kubernetes
            port:
              number: 443
        path: /
        pathType: Prefix
  tls:
  - hosts:
    - kubernetes.cluster-eu.spring-staging.academy
    secretName: wildcard
EOF

# Wait for the token controller to populate the secret with a token:
while ! kubectl describe secret default-token | grep -E '^token' >/dev/null; do
  echo "waiting for token..." >&2
  sleep 1
done

# Get the token value
TOKEN=$(kubectl get secret default-token -o jsonpath='{.data.token}' | base64 --decode)

# Explore the API with TOKEN
curl -k -X GET $APISERVER/training.educates.dev/v1beta1/trainingportals --header "Authorization: Bearer $TOKEN"
```
