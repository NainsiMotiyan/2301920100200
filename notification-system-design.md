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
# Stage 2

## Database Selection

For the notification system, I chose **PostgreSQL** as the primary database.

### Reasons for choosing PostgreSQL

* Provides ACID compliance, ensuring reliable storage of notifications.
* Supports transactions for consistent updates.
* Excellent indexing capabilities for fast searches.
* Handles large volumes of structured notification data efficiently.
* Supports sorting, filtering, and pagination effectively.
* Widely used in production systems and easy to scale.

---

## Database Schema

### Students Table

| Column      | Data Type    | Constraint                |
| ----------- | ------------ | ------------------------- |
| student_id  | UUID         | Primary Key               |
| roll_number | VARCHAR(20)  | Unique                    |
| name        | VARCHAR(100) | Not Null                  |
| email       | VARCHAR(100) | Unique                    |
| created_at  | TIMESTAMP    | Default CURRENT_TIMESTAMP |

---

### Notifications Table

| Column          | Data Type    | Constraint                        |
| --------------- | ------------ | --------------------------------- |
| notification_id | UUID         | Primary Key                       |
| student_id      | UUID         | Foreign Key → students.student_id |
| type            | VARCHAR(30)  | Not Null                          |
| title           | VARCHAR(150) | Not Null                          |
| message         | TEXT         | Not Null                          |
| is_read         | BOOLEAN      | Default FALSE                     |
| created_at      | TIMESTAMP    | Default CURRENT_TIMESTAMP         |

---

## Relationship

One student can receive many notifications.

```
Students
---------
student_id (PK)
roll_number
name
email
        |
        | 1
        |
        | *
Notifications
--------------
notification_id (PK)
student_id (FK)
type
title
message
is_read
created_at
```

---

## SQL Schema

```sql
CREATE TABLE students (
    student_id UUID PRIMARY KEY,
    roll_number VARCHAR(20) UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY,
    student_id UUID REFERENCES students(student_id),
    type VARCHAR(30) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## SQL Queries

### Get All Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = ?
ORDER BY created_at DESC;
```

---

### Get Unread Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = ?
AND is_read = FALSE
ORDER BY created_at DESC;
```

---

### Filter Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = ?
AND type = ?
AND is_read = ?
ORDER BY created_at DESC;
```

---

### Mark Notification as Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE notification_id = ?;
```

---

### Mark All Notifications as Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE student_id = ?;
```

---

### Delete Notification

```sql
DELETE
FROM notifications
WHERE notification_id = ?;
```

---

## Indexes

```sql
CREATE INDEX idx_notification_student
ON notifications(student_id);

CREATE INDEX idx_notification_created
ON notifications(created_at DESC);

CREATE INDEX idx_notification_read
ON notifications(is_read);

CREATE INDEX idx_notification_type
ON notifications(type);
```

---

## Potential Challenges

As the number of users and notifications increases, the following issues may arise:

* Notification table may grow to millions of records.
* Filtering unread notifications may become slower.
* Sorting by creation time may require more processing.
* Simultaneous notification creation can increase database load.

---

## Proposed Solutions

* Create indexes on frequently queried columns.
* Use pagination when retrieving notifications.
* Archive old notifications periodically.
* Partition large tables based on creation date.
* Cache frequently accessed data such as unread notification counts.
* Process notification creation asynchronously using a message queue if traffic increases significantly.
# Stage 3

## Query Optimization

As the notification system grows and more students start using it, the database will have to handle a large number of read and write operations. The following optimizations are suggested to keep the application responsive and improve query performance.

---

## 1. Fetch All Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = ?
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
```

### Why this query?

Notifications are displayed with the most recent ones first. Instead of loading every notification at once, pagination is used so only a limited number of records are returned in each request. This improves response time and reduces unnecessary database load.

---

## 2. Fetch Unread Notifications

```sql
SELECT *
FROM notifications
WHERE student_id = ?
AND is_read = FALSE
ORDER BY created_at DESC;
```

### Why this query?

Students usually check unread notifications first. Filtering unread records directly in the database is much more efficient than retrieving all notifications and filtering them in the application.

To improve performance further, a composite index on `student_id` and `is_read` can be created.

```sql
CREATE INDEX idx_student_read
ON notifications(student_id, is_read);
```

---

## 3. Filter Notifications by Type

```sql
SELECT *
FROM notifications
WHERE student_id = ?
AND type = ?
ORDER BY created_at DESC;
```

### Why this query?

Students may only want to view a specific category such as placements, events, or results. Filtering in the database reduces the amount of data sent to the frontend and provides faster results.

---

## 4. Mark a Notification as Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE notification_id = ?;
```

### Why this query?

Each notification has a unique ID, so updating a single record is straightforward and efficient. Since the primary key is indexed automatically, the update operation remains fast.

---

## 5. Mark All Notifications as Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE student_id = ?
AND is_read = FALSE;
```

### Why this query?

Updating only unread notifications avoids unnecessary database writes and improves overall efficiency.

---

# Possible Performance Challenges

As the application becomes more popular, a few performance issues may arise.

* The notifications table can grow very large over time.
* Fetching notifications without indexes may become slow.
* Sorting notifications by date for every request can increase query execution time.
* A large number of students accessing the system simultaneously can increase database load.

---

# Suggested Improvements

### Add Indexes

Creating indexes on frequently searched columns such as `student_id`, `is_read`, `type`, and `created_at` will significantly improve query performance.

---

### Use Pagination

Instead of returning every notification, only a small set of records should be fetched in each request using `LIMIT` and `OFFSET`. This reduces response time and improves the user experience.

---

### Archive Older Notifications

Notifications that are no longer accessed frequently can be moved to an archive table. This keeps the active table smaller and allows recent notifications to be retrieved more quickly.

---

### Partition Large Tables

If the number of notifications becomes very large, the table can be partitioned based on the creation date. This helps the database scan fewer records during queries.

---

### Cache Frequently Requested Data

Information such as the unread notification count can be cached using a tool like Redis. This reduces repeated database queries and improves application performance.

---

# Conclusion

The proposed optimizations focus on reducing query execution time, minimizing unnecessary database operations, and ensuring that the system continues to perform well as the number of users and notifications increases. By combining proper indexing, pagination, archiving, and caching, the notification system can remain efficient and scalable even under heavy usage.
# Stage 4

## Scaling the Notification System

The current notification system works well for a small number of users. However, as the number of students and notifications increases, additional architectural improvements are required to maintain performance and reliability.

---

## Challenges

As usage grows, the system may face the following challenges:

* A large number of students may request notifications at the same time.
* The notification database may contain millions of records.
* Real-time notification delivery can become difficult during peak traffic.
* Frequent database reads and writes may increase response time.

---

## Proposed Architecture

```
                Client (React App)
                       |
                 Load Balancer
                       |
          -------------------------
          |                       |
     Backend Server 1       Backend Server 2
          |                       |
          -------- Notification Service -------
                         |
                    Message Queue
                         |
                    PostgreSQL Database
                         |
                         Redis Cache
```

---

## Load Balancer

A load balancer distributes incoming requests across multiple backend servers instead of sending all traffic to a single server.

### Benefits

* Prevents one server from becoming overloaded.
* Improves application availability.
* Allows additional backend servers to be added easily.

---

## Database Scaling

As notification records grow, database performance may decrease.

To improve scalability:

* Add indexes on frequently searched columns.
* Archive old notifications.
* Partition large tables based on creation date.
* Use read replicas for read-heavy workloads.

---

## Caching

Frequently requested information, such as unread notification counts or recently viewed notifications, can be stored in Redis.

Benefits include:

* Faster response time.
* Reduced database load.
* Improved user experience.

---

## Message Queue

Instead of sending notifications directly after every event, notifications can first be placed in a message queue.

The notification service processes messages from the queue and delivers them to users.

Benefits:

* Smooth handling of traffic spikes.
* Reliable notification processing.
* Better fault tolerance.

---

## Real-Time Delivery

WebSockets remain the preferred choice for real-time communication.

Once a student connects, the server can push new notifications immediately without requiring repeated API requests.

---

## Monitoring

The system should continuously monitor:

* API response times
* Database performance
* Failed notification deliveries
* Server resource usage

Logs should be captured using the provided logging middleware instead of console logging.

---

## Conclusion

By introducing load balancing, caching, message queues, database optimization, and WebSocket communication, the notification system can efficiently support a much larger number of users while maintaining fast response times and reliable notification delivery.
