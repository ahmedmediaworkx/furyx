# FuryX

FuryX is a SaaS Kanban app for planning and tracking work in a simple visual way. Teams use it to create boards, add tasks, move work through stages, and stay updated in real time.

## What FuryX Is For

FuryX helps teams answer three questions quickly:

- What work needs to be done?
- Who is working on it?
- What is the current status?

It is designed for product teams, operations teams, agencies, startups, and small businesses that want a clear way to manage work without complicated project management software.

## Main Parts of the App

### 1. Login and Registration

Users can create an account or sign in to an existing account.

What happens:

- A new user signs up with name, email, and password.
- The app creates a secure account.
- After login, the user enters their workspace dashboard.

### 2. Dashboard

The dashboard is the starting page after login.

What users see:

- Their boards
- A button to create a new board
- Quick access to open any board

### 3. Boards

A board is a workspace for one project or one team flow.

Examples:

- Product roadmap board
- Marketing campaign board
- Client delivery board
- Hiring pipeline board

Each board contains columns and tasks.

### 4. Columns

Columns are the stages of work.

Common examples:

- Backlog
- In Progress
- Review
- Done

Teams can rename columns to match their own process.

### 5. Tasks

Tasks are the individual pieces of work inside a board.

Each task can include:

- Title
- Description
- Priority
- Labels
- Assignee
- Due date

Tasks are moved between columns as work progresses.

### 6. Drag and Drop

Users can drag a task from one column to another.

What happens:

- The task changes status immediately.
- Everyone watching the board sees the change.
- The board stays in sync without manual refresh.

### 7. Real-Time Updates

FuryX updates the board live.

This means:

- When one user moves a task, others see it quickly.
- When a task is added or edited, the board stays current.
- Teams can collaborate at the same time without confusion.

## User Roles

### Owner

The owner controls the workspace and billing.

They can:

- Create and manage boards
- Invite people
- Change workspace settings
- Manage subscription plans

### Member

Members work on tasks inside the board.

They can:

- View boards they have access to
- Create and update tasks
- Move work through columns
- Collaborate with the team

### Viewer

Viewers can see progress but cannot change the board.

This is useful for:

- Clients
- Stakeholders
- Managers who only need visibility

## What Happens Behind the Scenes

This section explains the app in simple terms.

### When a user logs in

- The app checks the user’s email and password.
- If the details are correct, the user gets access.
- If not, the app shows an error message.

### When a user creates a board

- The board is saved for that workspace.
- FuryX creates default columns to get the board started.
- The new board appears on the dashboard.

### When a user creates a task

- The task is saved inside the selected board and column.
- Other users on the board can see it.
- The task becomes part of the team’s shared workflow.

### When a task is moved

- FuryX updates the task’s status.
- The move is shared in real time.
- Everyone sees the latest version of the board.

### Where data is stored

FuryX keeps its data in a database so boards and tasks are not lost when the page closes.

Stored data includes:

- Users
- Boards
- Columns
- Tasks
- Task order
- Activity changes

## Core Experience Flow

1. A user signs up or logs in.
2. They land on the dashboard.
3. They create a board for a project.
4. The board starts with columns.
5. They add tasks into the first column.
6. The team moves tasks as work progresses.
7. Everyone sees updates live.
8. The workspace becomes the team’s daily planning hub.

## Why Teams Use FuryX

- It is simple to understand.
- It works well for visual planning.
- It keeps teams aligned.
- It supports live collaboration.
- It is easier to adopt than heavier project management tools.

## Product Boundaries

FuryX focuses on the essentials first.

It is designed for:

- Board-based planning
- Task tracking
- Team collaboration
- Realtime visibility

It does not try to be everything at once.

## Non-Technical Summary

If you are not an engineer, think of FuryX as a shared digital whiteboard for work.

- Boards are the big workspaces.
- Columns are the steps in a process.
- Tasks are the sticky notes.
- Drag and drop moves the notes.
- Real-time updates keep everyone on the same page.

## Intended Outcome

FuryX should help teams move faster, stay organized, and reduce confusion about who is doing what.

## AWS Deployment

If you want to run FuryX on AWS, see [docs/aws-deployment.md](docs/aws-deployment.md).

The deployment path is container-first:

- Build the app with Docker
- Push the image to Amazon ECR
- Run it on ECS Fargate behind an Application Load Balancer
- Store secrets in AWS Secrets Manager
- Keep MongoDB in Atlas or move it to DocumentDB if you want a fully AWS-managed data layer