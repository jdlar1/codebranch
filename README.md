# Candidate assesment deliverable

This repository contains all 3 parts of the challenge organized in 3 folders:

## Fastapi-backend
Which is the primarily used for handling all the logic and calculation. Incudes also validation via Pydantic.

## Nestjs-backend
Which acts as a proxy backend validating the models and passing them to Fastapi backend via HTTP requests.

## Nextjs-frontend
Its build to make a GUI to interface with, with a simple map and utilities to visualize the results.

# Approach
The first task is to create a Docker Compose with all the services. I identify the following services:
- *Python backend*: no database since there isn't permanent data persistence.
- *NestJS backend*: as Proxy for requests.
- *Redis*: Since cache is mentioned is a good use case for a kv database.
- *NextjS*: Basic frontend.

Reasoning behing all of then follows:

## Python backend
Python env is set up using uv to create a reproducible environment. The repo is organized into basic Python files because it is a small project.
After setting up a basic health endpoint, the models identified for the job are `Point`, `PointListRequest`, `Bounds`, and `CentroidResponse`.
Then a logic for calculating centroid and bounds is implemented in the app file. It is procedural and easy to follow so I consider the code at `app.py` documents itself.
Finally, the default 422 error for validation error is overriden with the 400 required error.

## NestJS backend
NestJS is configured as middleware with Redis caching and HTTP proxy functionality. The service validates input using class-validator decorators that mirror the Pydantic models.
Cache keys are generated from sorted coordinates to ensure consistent caching regardless of input order. The service forwards requests to FastAPI and caches successful responses with a 5-minute TTL.
Error handling transforms FastAPI error responses to maintain consistent status codes, particularly ensuring 400 errors for validation failures.

## NextJS frontend
NextJS app provides an interactive interface with real-time coordinate processing and map visualization using Leaflet. Components are built with TypeScript and shadcn/ui for consistent styling.
The application uses TanStack Query for state management and automatic data fetching. Points are processed immediately when added, with visual feedback through loading states and toast notifications.
Map integration shows input points, calculated centroid, and bounding box with interactive markers and popups containing coordinate details.

# How to run it
To run it locally, Docker has to be installed and it can be launched with the following commands:

```bash
docker compose build --no-cache
docker compose up
```

Then following services are live:
- fastapi backend at `localhost:8000`. With its docs at `localhost:8000/docs`
- nestjs backend at `localhost:3001`
- nextjs frontend at `localhost:3000`




# Used tools
- Github Copilot Free was used to assist the code writing so it could be finished faster.
- Claude Desktop to debug some issues with NestJS and build the layout for the frontend.
- Documentation search in the Fastapi, NextJS, NestJS, and Docker websites. Specially for NestJS since it is the less known framework for me.