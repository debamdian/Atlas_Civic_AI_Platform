# Deployment Guide

## Backend Deployment (Docker/Render)

The backend is containerized using Docker. You can deploy it to any service that supports Docker (Render, Railway, Google Cloud Run, AWS App Runner).

### Prerequisites
- Firebase Service Account Key (`serviceAccountKey.json`) or set via Environment Variables.
- `.env` variables configured.

### Using Render.com
1. Connect your Git repository.
2. Create a new **Web Service**.
3. Select `Docker` as the environment.
4. Set Environment Variables:
   - `PORT`: `5000`
   - `FIREBASE_PROJECT_ID`: `your-project-id`
   - `FIREBASE_CLIENT_EMAIL`: `your-client-email`
   - `FIREBASE_PRIVATE_KEY`: `your-private-key` (Handle newlines correctly!)
   - `JWT_SECRET`: `your-secret`
5. Deploy.

## Frontend Deployment (Vercel)

The frontend is a Next.js application, optimized for deployment on Vercel.

1. Install Vercel CLI or use the Dashboard.
2. Import the `frontend` directory.
3. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.onrender.com/api/v1`
4. Deploy.

## Local Development (Docker Compose - Optional)

If you want to run the backend and frontend locally with Docker Compose, create a `docker-compose.yml` at the root:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    env_file: ./backend/.env
```
