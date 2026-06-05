FROM node:22-alpine

WORKDIR /workspace

RUN corepack enable

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY website ./website
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @dadi-kapida/website build

EXPOSE 3002

CMD ["pnpm", "--filter", "@dadi-kapida/website", "start"]
