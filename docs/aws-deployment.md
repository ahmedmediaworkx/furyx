# FuryX on AWS

This repository is ready to deploy on AWS as a containerized app.

## Recommended AWS Services

- Amazon ECR for the Docker image
- Amazon ECS on Fargate for the running app
- Application Load Balancer for public traffic
- AWS Secrets Manager for `NEXTAUTH_SECRET` and `MONGODB_URI`
- Amazon CloudWatch Logs for container logs
- Amazon Route 53 and ACM for the custom domain and TLS certificate

## Database Choice

FuryX uses MongoDB via Mongoose.

- Easiest path: keep `MONGODB_URI` pointed at MongoDB Atlas.
- AWS-native path: move `MONGODB_URI` to Amazon DocumentDB if you want to keep everything inside AWS.

## Deployment Topology

For the first AWS deployment, run a single ECS task behind the load balancer.

Why:

- The app serves Next.js and NestJS from one Node process.
- Socket.IO is currently in-process, so horizontal scaling needs a Redis adapter later.

If you want multiple ECS tasks later, add ElastiCache Redis and a Socket.IO Redis adapter first.

## Required Environment Variables

- `NODE_ENV=production`
- `PORT=3000`
- `NEXTAUTH_URL=https://your-domain.com`
- `NEXTAUTH_SECRET=your-long-random-secret`
- `MONGODB_URI=your-mongodb-connection-string`

## Build and Push to ECR

1. Create an ECR repository, for example `furyx`.
2. Build the image locally.
3. Tag it with your ECR repository URI.
4. Push it to ECR.

Example flow:

```bash
docker build -t furyx .
docker tag furyx:latest <account-id>.dkr.ecr.<region>.amazonaws.com/furyx:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/furyx:latest
```

## ECS Fargate Setup

1. Create an ECS cluster.
2. Register the task definition from `infra/aws/ecs-task-definition.json`.
3. Create a service using Fargate launch type.
4. Attach an Application Load Balancer.
5. Point the target group health check to `/`.
6. Set desired task count to `1` for the first release.

## Secrets Manager Setup

Store these values as secrets, not plain environment variables:

- `NEXTAUTH_SECRET`
- `MONGODB_URI`

Keep non-sensitive values like `PORT` and `NEXTAUTH_URL` in the task definition environment block.

## Domain and TLS

1. Request an ACM certificate for your domain.
2. Attach the certificate to the load balancer.
3. Create a Route 53 alias record to the ALB.

## Notes

- The Dockerfile builds both the Next.js app and the NestJS server before runtime.
- The runtime entrypoint is `server.js`, which loads the compiled Nest bootstrap from `dist/`.
- If you later want autoscaling with multiple tasks, add a shared Socket.IO adapter first.