# API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication

### POST `/auth/signup`
Create a new user account.
- **Body**: `{ "email": "user@example.com", "password": "password123", "role": "citizen" }`
- **Response**: `{ "message": "User created successfully", "userId": "..." }`

### POST `/auth/login`
Login and receive a JWT.
- **Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**: `{ "token": "ey...", "user": { ... } }`

## Complaints

### POST `/complaints` (Multipart)
Submit a new complaint.
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Body Fields**: `title`, `description`, `category`, `latitude`, `longitude`, `address`
- **Files**: `images` (array)
- **Response**: `{ "id": "...", "status": "created", ... }`

### GET `/complaints/my`
Get complaints submitted by the current user.

### GET `/complaints` (Admin)
Get all complaints with optional filters.
- **Query Params**: `status`, `category`, `priority`

### PATCH `/complaints/:id/status` (Admin/Worker)
Update a complaint's status.
- **Body**: `{ "status": "in_progress" }`

## Tasks

### POST `/tasks/assign` (Admin)
Assign a complaint to a worker.
- **Body**: `{ "complaintId": "...", "workerId": "...", "instructions": "..." }`

### GET `/tasks/my` (Worker)
Get tasks assigned to the current worker.

### POST `/tasks/:id/complete` (Worker, Multipart)
Mark a task as completed and upload evidence.
- **Body Fields**: `notes`
- **Files**: `evidence` (images)
