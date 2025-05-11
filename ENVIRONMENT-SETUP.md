# Environment Configuration Guide

This document explains how the environment variables are set up in the Wedding Planning platform for flexible deployment across different environments.

## Frontend Environment Variables

### Configuration Files

The environment variables are configured in:

- `src/config/env.js`: Central configuration file that exports environment variables with fallbacks
- `.env` or `.env.development`: Local development environment variables
- `.env.production`: Production environment variables

### Available Variables

| Variable            | Purpose                            | Default Value                     |
| ------------------- | ---------------------------------- | --------------------------------- |
| `VITE_API_BASE_URL` | Base URL for API calls             | `http://localhost:5000/api`       |
| `VITE_API_DOMAIN`   | Domain for API without `/api` path | `http://localhost:5000`           |
| `VITE_FRONTEND_URL` | Frontend application URL           | Various, depending on environment |

### How to Use

In your React components, import and use the environment variables like this:

```javascript
import { API_BASE_URL } from "../../config/env";

// Example usage
fetch(`${API_BASE_URL}/your-endpoint`, {
  // request options
});
```

## Backend Environment Variables

In the backend, these environment variables should be defined:

| Variable               | Purpose                                       | Default Value                                 |
| ---------------------- | --------------------------------------------- | --------------------------------------------- |
| `BACKEND_URL`          | Backend server URL for webhooks and callbacks | `http://localhost:5000`                       |
| `FRONTEND_URL`         | Frontend application URL for redirects        | `https://weddingplanning-1-joi4.onrender.com` |
| `CHAPA_SECRET_KEY`     | Chapa payment API key                         | (no default, must be provided)                |
| `CHAPA_WEBHOOK_SECRET` | Secret for verifying Chapa webhooks           | (no default, must be provided)                |

## Setting Up for Different Environments

### Local Development

Create a `.env` file in the frontend project root:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_DOMAIN=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173
```

### Production

Create a `.env.production` file in the frontend project root:

```
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_API_DOMAIN=https://your-backend-url.com
VITE_FRONTEND_URL=https://weddingplanning-1-joi4.onrender.com
```

## Deployment Considerations

When deploying to platforms like Render, Netlify, or Vercel:

1. Set the environment variables in the platform's dashboard
2. Make sure CORS is properly configured on the backend to accept requests from the frontend domain
3. Ensure the backend URL is publicly accessible for webhooks
4. Set up proper redirect URLs for authentication and payment flows
