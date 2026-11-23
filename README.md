# FullRisk website

Standalone home page in launcher style. The public news and 24 hour player count need no launcher token; launcher-only controls are visual placeholders.

The renderer supports cosmetics, but this standalone public site has no launcher token, so it currently shows the skin without those cosmetics.
Do not put a private launcher token in the browser code.

## Local development

From this directory, run `yarn install` and `yarn dev`. Vite prints the local URL. API and skin requests are proxied in `vite.config.ts`.

## Run on a server with Docker

Clone this repository to the server into a folder, then run inside it:

```sh
docker compose up -d --build
```

The container listens only on `127.0.0.1:8085`. To update after copying new files, run the same compose command again.

Add a server block to your existing host Nginx configuration, using a new hostname (or an unused URL path):

```nginx
server {
    listen 80;
    server_name fullrisk.net;

    location / {
        proxy_pass http://127.0.0.1:8085;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Replace `fullrisk.net` with your domain.
