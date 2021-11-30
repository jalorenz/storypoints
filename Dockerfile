FROM node:17 as builder

WORKDIR /build

COPY ["package.json", "package-lock.json", "./"]

RUN npm install
