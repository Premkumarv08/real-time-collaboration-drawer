# Real-Time Collaborative Drawing App

## Overview
This is a real-time collaborative drawing application that allows multiple users to draw on a shared canvas simultaneously. The updates are synchronized across all connected clients using WebSocket technology.

## Features
✅ Live Drawing Sync: Users see each other's updates in real time.  
✅ Brush Customization: Change color and brush size.  
✅ User Connection Handling: Notifications when users join or leave.  
✅ Reset Canvas: A button to clear the canvas for all users.  
✅ Scalable WebSocket Server: Handles multiple clients efficiently.

## Tech Stack
**Frontend:** HTML5 Canvas, JavaScript, React 
**Backend:** Node.js, Express, WebSockets (Socket.io)  
**Hosting:** Vercel (Frontend), Render/Heroku (Backend)  

## Installation
### **1️⃣ Backend Setup**
```sh
cd server
npm install  # Install dependencies
node server.js  # Start WebSocket server
```

### **2️⃣ Frontend Setup**
```sh
cd client
npm install  # Install dependencies
npm start  # Run the app locally
```

## Deployment
### **Deploy Backend** (Render/Heroku)
1. Push your backend to GitHub.
2. Connect your GitHub repo to **Render** or **Heroku**.
3. Deploy your WebSocket server.
4. Get the WebSocket URL (e.g., `wss://your-app.onrender.com`).

### **Deploy Frontend** (Vercel/Netlify)
1. Push your frontend code to GitHub.
2. Connect your GitHub repo to **Vercel**.
3. Set the WebSocket URL in the frontend code.
4. Deploy and get the live URL!

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m "Added new feature"`).
4. Push to GitHub and create a pull request.