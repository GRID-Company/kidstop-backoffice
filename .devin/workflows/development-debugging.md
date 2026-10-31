---
description: Debug a backend service or API running on the dev test server
---

# Development Debugging

Use this workflow when a backend service/API on the dev test server is not responding or is failing.

> **Architecture note:** since the migration off Docker, services run as native systemd units (`api-<svc>`) on the Lightsail host, behind a native Traefik (`traefik.service`) with file-provider routing (`/etc/traefik/dynamic.yaml`) and a native Redis (`redis6.service`). There is no Docker on the hot path.

## 1. Identify the target service

Ask the user which service/API is being investigated.

- Services and their units/ports live in `top-dev-backend-instance/systemd/api-<svc>.service` and `top-dev-backend-instance/traefik/dynamic.yaml`.
- Common services/routes on `dev.topdev.mx` (unit → port):
  - `/backsystem` → `api-backsystem` → 127.0.0.1:3101
  - `/ksp` → `api-ksp` → 127.0.0.1:3104
  - `/mgelectric` → `api-mgelectric` → 127.0.0.1:3105
  - `/mkt3030` → `api-mkt3030` → 127.0.0.1:3106
  - `/erp` → `api-erp` → 127.0.0.1:3108
  - `/nbg` → `api-nbg` → 127.0.0.1:3110
- Env vars per service: `/srv/dev-stack/env/<svc>.env` on the server (uploaded via `scripts/upload_envs.sh`).

## 2. Connect to the dev server

Use the Lightsail SSH key:

```bash
ssh -i /Users/alexisdanielvillicanabarrera/Documents/Repos/Grid/top-dev-backend-instance/LightsailDefaultKey-us-east-2.pem ec2-user@13.59.57.223
```

Or use the helper script:

```bash
bash /Users/alexisdanielvillicanabarrera/Documents/Repos/Grid/top-dev-backend-instance/scripts/connect_server.sh
```

## 3. Inspect service state

```bash
systemctl status api-<service> --no-pager
systemctl is-active api-<service>
ls -l /srv/apps/<service>/current          # which release is live
ls -1t /srv/apps/<service>/releases/       # recent releases
```

Look for:
- Units in `activating`/restart loops or `failed` state
- `current` symlink pointing at a missing/stale release
- Missing env file or port already in use

## 4. Read logs

```bash
journalctl -u api-<service> -n 100 --no-pager   # or follow: -f
```

Or from your workstation:

```bash
bash /Users/alexisdanielvillicanabarrera/Documents/Repos/Grid/top-dev-backend-instance/scripts/tail_logs.sh <service>
```

Also check Traefik if routing/TLS is the issue:

```bash
journalctl -u traefik -n 100 --no-pager
```

## 5. Verify routing internally

From the server, test the service directly on its localhost port:

```bash
curl -s http://127.0.0.1:<port>/graphql -H "Content-Type: application/json" -d '{"query":"{ __typename }"}'
```

And through Traefik:

```bash
curl -s https://dev.topdev.mx/<prefix>/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

If Traefik itself is down: `systemctl status traefik`, check `/etc/traefik/dynamic.yaml` routing and `/etc/traefik/acme.json` (perms `traefik:traefik` 0600).

## 6. Fix the root cause

Typical causes:
- TypeORM schema sync failure (`TYPEORM_SYNC=true` with conflicting data)
- Missing env var (check `/srv/dev-stack/env/<svc>.env` vs the unit's `Environment=` overrides)
- Redis (`redis6.service`) down or wrong `REDIS_*` override
- Bad release staged — roll back with `scripts/deploy_app.sh <svc> <previous-sha>`

Apply the minimal upstream fix (entity/code/config) rather than a workaround on the server.

## 7. Redeploy

Normal redeploy: push to the repo's deploy branch (GitHub Actions builds the artifact and restarts the unit), or dispatch the workflow manually. To roll back to a previous release without a new build:

```bash
bash /Users/alexisdanielvillicanabarrera/Documents/Repos/Grid/top-dev-backend-instance/scripts/deploy_app.sh <service> list
bash /Users/alexisdanielvillicanabarrera/Documents/Repos/Grid/top-dev-backend-instance/scripts/deploy_app.sh <service> <release-sha>
```

Verify `systemctl is-active api-<service>` and that the public endpoint responds.
