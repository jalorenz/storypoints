docker build -t storypoints-e2e:latest ..
docker run -d -p 3333:3000 -e FRONTEND_BASE_URL=http://example.com storypoints-e2e:latest

npm install

# npm run ui
