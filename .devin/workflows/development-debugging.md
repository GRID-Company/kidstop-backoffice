---
description: Debug a backend service or API running on the dev test server
---

# Development Debugging

Use this workflow when a backend service/API on the dev test server is not responding or is failing.

## 1. Identify the target service

Ask the user which service/API is being investigated.

- Look up the service in `@/Users/alexisdanielvillicanabarrera/Documents/Repos/Grid/top-dev-backend-instance/docker-compose.yaml`.
- Note its container name, image, route prefix, and Redis dependency.
- Common services/routes on `dev.topdev.mx`:
  - `/sec` → `api-sec` (`sec-backend-development:latest`)
  - `/ksp` → `api-ksp`
  - `/mkt3030` → `api-mkt3030`
  - `/mgelectric` → `api-mgelectric`
  - `/backsystem` → `api-backsystem`

## 2. Connect to the dev server

Use the Lightsail SSH key:

```bash
ssh -i /Users/alexisdanielvillicanabarrera/Documents/Repos/Grid/top-dev-backend-instance/api-deployment/LightsailDefaultKey-us-east-2.pem ec2-user@13.59.57.223
```

Or use the helper script:

```bash
bash /Users/alexisdanielvillicanabarrera/Documents/Repos/Grid/top-dev-backend-instance/api-deployment/scripts/connect_server.sh
```

## 3. Inspect container state

```bash
docker ps
docker compose -f /srv/dev-stack/docker-compose.yaml ps
```

Look for:
- Containers stuck in `Restarting` loop
- Unhealthy or exited containers
- Missing containers

## 4. Read logs

```bash
docker logs --tail 100 dev-stack-api-<service>-1
```

Also check Traefik if routing is the issue:

```bash
docker logs --tail 100 traefik
```

## 5. Verify routing internally

From inside the server, test the service directly:

```bash
curl -s http://api-<service>:3000/health
```

And through Traefik:

```bash
curl -s https://dev.topdev.mx/<prefix>/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

## 6. Fix the root cause

Typical causes:
- TypeORM schema sync failure (`TYPEORM_SYNC=true` with conflicting data)
- Missing or unhealthy Redis dependency
- New image not pulled / container using stale image
- Environment variable mismatch

Apply the minimal upstream fix (entity/code/config) rather than a workaround on the server.

## 7. Redeploy the stack

After building and pushing the corrected image to ECR, redeploy:

```bash
bash /Users/alexisdanielvillicanabarrera/Documents/Repos/Grid/top-dev-backend-instance/api-deployment/scripts/deploy_stack.sh
```

Verify the container is healthy and the public endpoint responds.
