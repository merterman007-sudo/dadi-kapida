FROM node:22-alpine

WORKDIR /workspace

RUN corepack enable

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @dadi-kapida/database db:generate
RUN pnpm --filter @dadi-kapida/api build

EXPOSE 3001

CMD ["pnpm", "--filter", "@dadi-kapida/api", "start"]
