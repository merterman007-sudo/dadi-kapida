FROM node:22-alpine

WORKDIR /workspace

RUN corepack enable

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @dadi-kapida/web build

EXPOSE 3000

CMD ["pnpm", "--filter", "@dadi-kapida/web", "start"]
