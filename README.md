Event Discovery & Ticketing API

A RESTful API built with Node.js, Express.js, and MongoDB that allows users to discover events, retrieve event information, manage event listings, and book tickets.

The API provides event search, filtering, pagination, and secure ticket reservation with transactional database operations to maintain booking consistency and prevent overselling.

1. Project Overview

The Event Discovery & Ticketing API is designed to simplify event management and ticket booking.

It provides endpoints for:

Creating and managing events.

Retrieving available events.

Searching events by title and description.

Filtering events by city, category, and date.

Managing event capacity and availability.

Booking tickets for events.

Retrieving bookings associated with specific events.

2. Technologies Used

Technology

Purpose

Node.js

JavaScript runtime

Express.js

Backend web framework

MongoDB

NoSQL database

Mongoose

MongoDB object modelling

Joi

Request validation

Helmet

HTTP security headers

CORS

Cross-origin resource sharing

Express Rate Limit

API request rate limiting

Morgan

HTTP request logging

dotenv

Environment variable management

Nodemon

Development server automation

Git & GitHub

Version control

Render

Application deployment

3. Features

Event Management

Create new events.

Retrieve all events.

Retrieve individual events.

Update existing events.

Delete events.

Track event capacity and available seats.

Event Discovery

Search events by title and description.

Filter events by city.

Filter events by category.

Filter events using date ranges.

Sort events by event date.

Paginate event results.

Ticket Booking

Book tickets for upcoming events.

Validate attendee information.

Check available seats before booking.

Prevent bookings for cancelled or past events.

Prevent ticket overselling through atomic database updates.

Use MongoDB transactions to maintain consistency between event seat counts and booking records.

API Security

Helmet security middleware.

CORS configuration.

API rate limiting.

Joi request validation.

Centralized error handling.

Environment-based configuration.

4. Project Structure

event-discovery-api/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── eventController.js
│   └── bookingController.js
│
├── middleware/
│   ├── errorHandler.js
│   ├── notFound.js
│   ├── rateLimiter.js
│   └── validate.js
│
├── models/
│   ├── Event.js
│   └── Booking.js
│
├── routes/
│   ├── eventRoutes.js
│   └── bookingRoutes.js
│
├── validators/
│   ├── eventValidator.js
│   ├── bookingValidator.js
│   └── eventQueryValidator.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js

5. Installation and Setup

Prerequisites

Ensure you have installed:

Node.js

npm

MongoDB Atlas account or a MongoDB server

Git

Postman (for API testing)

Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL

Navigate into the project:

cd event-discovery-api

Install Dependencies

npm install

Configure Environment Variables

Create a .env file in the project root:

PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173

Replace the MongoDB placeholder with your actual connection string.

Never commit your .env file to GitHub.

Run the Application

Development mode:

npm run dev

Production mode:

npm start

The API will run on the configured port.

6. API Endpoints

Base URL:

http://localhost:3000

Events

Method

Endpoint

Description

GET

/

Check API status

POST

/api/events

Create an event

GET

/api/events

Retrieve all events

GET

/api/events/:id

Retrieve an individual event

PUT

/api/events/:id

Update an event

DELETE

/api/events/:id

Delete an event

Event Search and Filtering

The events endpoint supports query parameters.

Example:

GET /api/events?page=1&limit=10&sort=asc

Search events:

GET /api/events?search=technology

Filter by city:

GET /api/events?city=Kampala

Filter by category:

GET /api/events?category=Conference

Filter by date range:

GET /api/events?from=2026-12-01&to=2026-12-31

Combine filters:

GET /api/events?city=Kampala&category=Conference&page=1&limit=10

Bookings

Method

Endpoint

Description

POST

/api/events/:id/book

Book tickets for an event

GET

/api/events/:id/bookings

Retrieve bookings for an event

7. Sample API Requests

Create an Event

POST

/api/events

Request body:

{
    "title": "Technology Innovation Conference",
    "description": "A conference bringing together technology professionals.",
    "category": "Conference",
    "city": "Kampala",
    "venue": "Kampala Serena Hotel",
    "date": "2027-03-20T09:00:00.000Z",
    "price": 50000,
    "capacity": 200
}

Book Tickets

POST

/api/events/:id/book

Request body:

{
    "attendeeName": "John Doe",
    "attendeeEmail": "john@example.com",
    "seats": 2
}

A successful booking returns HTTP 201 Created and includes the booking information and remaining seats.

Retrieve Event Bookings

GET

/api/events/:id/bookings?page=1&limit=10

8. Event Availability and Booking Integrity

The API uses a Mongoose virtual property to calculate remaining seats:

eventSchema.virtual('seatsRemaining').get(function() {
    return this.capacity - this.seatsBooked;
});

The API also uses MongoDB atomic updates to reserve seats.

This ensures that concurrent booking requests cannot reserve more seats than the event's available capacity.

Booking creation and seat reservation are performed within a MongoDB transaction. If booking creation fails, the seat reservation is rolled back.

9. HTTP Status Codes

Status Code

Meaning

200

Request successful

201

Resource successfully created

400

Invalid request or validation failure

404

Resource not found

409

Booking conflict or insufficient seats

500

Internal server error

10. Security and Error Handling

The application implements:

Helmet for HTTP security headers.

Express Rate Limit to control excessive API requests.

CORS to manage permitted frontend origins.

Joi for request validation.

Centralized error handling.

Environment variables for sensitive configuration.

Mongoose validation for database records.

11. Deployment

The API is designed for deployment on Render.

Deployment requirements:

Configuration

Value

Runtime

Node.js

Build Command

npm install

Start Command

npm start

Environment

production

Database

MongoDB Atlas

Configure the following environment variables in Render:

NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=your_frontend_origin

Render automatically provides the application port through the PORT environment variable.

Live API: Add your deployed Render URL here.

12. Testing

The API can be tested using Postman.

Recommended test scenarios include:

Creating an event.

Retrieving all events.

Searching and filtering events.

Updating event information.

Deleting events.

Booking available seats.

Attempting to book more seats than available.

Attempting to book cancelled events.

Retrieving event bookings.

Testing invalid request data.

Testing pagination.

13. Future Improvements

Potential future enhancements include:

User authentication and authorization.

Event organizer accounts.

Payment gateway integration.

Booking cancellation and refunds.

Email booking confirmations.

QR-code ticket generation.

Event attendance verification.

Administrative dashboard.

14. Author

BD Adv Group 3 Sept 2026

1. Umar Musisi
2. Momodu Unique Rekiya

Backend Developers

Technologies: Node.js | Express.js | MongoDB | REST APIs

This project was developed as part of the BeTechified Advanced Backend Development learning programme.
