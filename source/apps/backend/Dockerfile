FROM node:16 as builder

WORKDIR /build

COPY ["source/package.json", "source/package-lock.json", "./"]

RUN npm install -g nx

RUN npm install

COPY ["source/nx.json", "source/tsconfig.base.json", "source/workspace.json", "./"]
COPY ["source/apps", "./apps/"]
COPY ["source/libs/", "./libs/"]

RUN nx build backend --prod

FROM node:16-slim

WORKDIR /usr/src/app/backend

ENV NODE_ENV=production

COPY --from=builder /build/dist/apps/backend/ ./dist/
COPY --from=builder /build/node_modules/ ./node_modules/
COPY source/package.json ./
COPY package.json /usr/src/app/

EXPOSE 3000

CMD ["npm", "run", "run-backend-prod"]
