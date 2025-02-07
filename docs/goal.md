# Goal

This open-source project should enable teams to deploy a story-points estimation tool in their own infrastructure. The tool should be easy to deploy and should provide a web frontend. 

## Decisions

- The estimation rooms should NOT be persisted. This means that no database is required which simplifies the deployment.
- The tool is provided via a single docker image and therefore only requires a single docker container to run.
- The tool should be easy to use and should not require any user authentication.