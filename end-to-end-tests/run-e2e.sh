docker build -t storypoints-e2e:latest ..
docker run -d -p 3333:3000 storypoints-e2e:latest

npm install

npm run test
