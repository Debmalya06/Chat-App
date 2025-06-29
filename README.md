# Chat-App

A full-stack real-time chat application with room-based messaging, built with React (Vite, Tailwind CSS) for the frontend and Spring Boot (Java, MongoDB) for the backend.

## Features
- Create and join chat rooms
- Real-time messaging with WebSocket (SockJS + STOMP)
- Emoji picker support
- File attachment support
- Dark mode toggle
- Responsive and modern UI

## Project Structure

```
Chat-App/
├── chat-app-backend/   # Spring Boot backend
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
└── client/             # React frontend
    ├── src/
    ├── package.json
    └── Dockerfile
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Java 21+
- Maven
- MongoDB (local or cloud, e.g. MongoDB Atlas)
- Docker (optional, for containerization)

### Backend Setup
1. Go to the backend folder:
   ```sh
   cd chat-app-backend
   ```
2. Configure MongoDB URI in `src/main/resources/application.properties`.
3. Build and run:
   ```sh
   mvn clean package
   java -jar target/chat-app-backend-0.0.1-SNAPSHOT.jar
   ```
   Or with Docker:
   ```sh
   docker build -t chat-app-backend .
   docker run -p 8080:8080 chat-app-backend
   ```

### Frontend Setup
1. Go to the client folder:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173)

### Environment URLs
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8080 (or your deployed backend URL)

## Deployment
- Both frontend and backend have Dockerfiles for easy deployment.
- For production, update CORS and WebSocket allowed origins in the backend to match your frontend URL.
- Example hosted backend: `https://chat-app-38ks.onrender.com`

## File Names
- This file: `README.md`

## License
MIT
