# Notification System Design
# Notification System Design

# Stage 1

## Overview

The Campus Notification System enables students to receive notifications related to placements, events, and examination results. The system follows RESTful API design principles and communicates using JSON. It also supports real-time notifications using WebSockets to provide instant updates without requiring users to refresh the application.

---

# REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /notifications | Fetch all notifications |
| GET | /notifications/unread | Fetch unread notifications |
| GET | /notifications?type={type}&isRead={true/false} | Filter notifications |
| PATCH | /notifications/{notificationId}/read | Mark a notification as read |
| PATCH | /notifications/read-all | Mark all notifications as read |

---

# Common Request Headers

```
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
```

---

# Notification Object

```json
{
    "id": "d146095a-0d86-4a34-9e69-3900a14576bc",
    "studentId": "2301920100200",
    "type": "Placement",
    "title": "Placement Drive",
    "message": "Microsoft is hiring Software Engineer Interns.",
    "isRead": false,
    "priority": 5,
    "createdAt": "2026-06-26T10:30:00Z"
}
```

---

# API Specifications

## 1. Get All Notifications

### Endpoint

```
GET /notifications
```

### Headers

```
Authorization: Bearer <token>
Accept: application/json
```

### Request Body

None

### Success Response (200 OK)

```json
{
    "success": true,
    "data": [
        {
            "id": "d146095a-0d86-4a34-9e69-3900a14576bc",
            "studentId": "2301920100200",
            "type": "Placement",
            "title": "Placement Drive",
            "message": "Microsoft is hiring Software Engineer Interns.",
            "isRead": false,
            "priority": 5,
            "createdAt": "2026-06-26T10:30:00Z"
        }
    ]
}
```

---

## 2. Get Unread Notifications

### Endpoint

```
GET /notifications/unread
```

### Headers

```
Authorization: Bearer <token>
Accept: application/json
```

### Request Body

None

### Success Response

```json
{
    "success": true,
    "data": [
        {
            "id": "b283218f-ea5a-4b7c-93a9-1f2f240d64b0",
            "type": "Result",
            "title": "Mid Semester Results",
            "message": "Results have been published.",
            "isRead": false,
            "createdAt": "2026-06-26T11:15:00Z"
        }
    ]
}
```

---

## 3. Filter Notifications

### Endpoint

```
GET /notifications?type=Placement&isRead=false
```

### Query Parameters

| Parameter | Type | Description |
|----------|------|-------------|
| type | String | Placement, Event or Result |
| isRead | Boolean | true or false |

### Headers

```
Authorization: Bearer <token>
```

### Success Response

```json
{
    "success": true,
    "data": [
        {
            "id": "cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8",
            "type": "Placement",
            "title": "Placement Drive",
            "message": "Amazon hiring SDE Interns",
            "isRead": false
        }
    ]
}
```

---

## 4. Mark Notification as Read

### Endpoint

```
PATCH /notifications/{notificationId}/read
```

Example

```
PATCH /notifications/d146095a-0d86-4a34-9e69-3900a14576bc/read
```

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{}
```

### Success Response

```json
{
    "success": true,
    "message": "Notification marked as read."
}
```

---

## 5. Mark All Notifications as Read

### Endpoint

```
PATCH /notifications/read-all
```

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{}
```

### Success Response

```json
{
    "success": true,
    "message": "All notifications marked as read."
}
```

---

# Standard Error Response

```json
{
    "success": false,
    "message": "Notification not found."
}
```

---

# HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Request Successful |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

# Real-Time Notification Mechanism

The system uses **WebSockets** to deliver notifications instantly to connected users.

## WebSocket Endpoint

```
ws://server/notifications
```

## Workflow

1. Student opens the application.
2. The frontend establishes a WebSocket connection with the server.
3. Whenever a new notification is generated, the backend immediately pushes the notification through the WebSocket connection.
4. The frontend receives the notification and updates the notification list instantly without refreshing the page.
5. Users can immediately mark notifications as read or filter them using the REST APIs.

## Advantages of WebSockets

- Real-time communication
- Low latency
- Reduced server load compared to continuous polling
- Better user experience
- Efficient bandwidth utilization

---

# Assumptions

- Users are pre-authorized and do not require login or registration.
- Every notification belongs to exactly one student.
- Notification types are Placement, Event, and Result.
- Every notification has a unique UUID.
- All APIs communicate using JSON.
- Notifications are ordered by creation time, with the latest notifications displayed first.

---

# Summary

The proposed API design provides a simple, scalable, and RESTful interface for managing notifications. REST APIs are used for CRUD-style operations such as fetching, filtering, and marking notifications as read, while WebSockets provide real-time notification delivery. This architecture offers good scalability, predictable endpoints, and a responsive user experience.
## Database Selection

I recommend PostgreSQL as the persistent storage because:

- ACID compliance ensures reliable notification storage.
- Excellent indexing support for fast retrieval.
- Supports JSON fields if needed.
- Highly scalable.
- Mature ecosystem.
- Suitable for filtering, sorting and pagination.

Although MongoDB is flexible, notifications have a well-defined structure and relational databases provide better consistency and query performance.