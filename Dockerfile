FROM node:16 as builder

WORKDIR /build

COPY ["package.json", "package-lock.json", "./"]

RUN npm install
