StreamSavvy is a movie discovery and watchlist application built as part of the Full Stack Web Development Project at SRM University.
It allows users to browse movies, filter content, view details, and maintain a personalized watchlist using a JSON-Server backend.
👥 Contributors
*This project was developed by:*

Vinay 

Manoj

Nasarvali

Prem Sai

Bhaswanth
🚀 Features

🎬 Browse Movies from local db.json

❤️ Add/Remove movies from Watchlist

🔍 Search and Filter by Genre & Year

📄 Movie Details Page

🔐 Authentication System

Login

Register

Logout

💾 Data stored using JSON-Server

📱 Fully Responsive UI for Desktop & Mobile

🛠️ Tech Stack
Layer	Technology
Frontend	React.js, React Router, Axios
Styling	TailwindCSS + Custom CSS
Backend	JSON-Server
Storage	JSON (db.json), LocalStorage
Icons & UX	React Icons, Toast Notifications
📂 Project Structure
stream-savvy/
│── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── MovieCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Movies.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── About.jsx
│   ├── utils/
│   │   ├── axiosInstance.js
│   │   ├── watchlist.js
│   ├── services/
│   │   ├── watchlistApi.js
│── db.json
│── README.md

▶️ Running the Project
//[TODO]

**Make sure Node.js is installed.**

1️⃣ Install Dependencies
**npm install**

2️⃣ Start JSON-Server
**npx json-server --watch db.json --port 5000**

3️⃣ Start React App
**npm run dev**


The application will run at:

http://localhost:5173


JSON API will be available at:

http://localhost:5000/movies

🔧 API Endpoints (JSON-Server)
Action	Endpoint
Get all movies	/movies
Get single movie	/movies/:id
Manage user data	/users
Watchlist storage	/watchlist


🎓 Academic Purpose

This project was created as part of the Full Stack Development Coursework
at SRM University, demonstrating real-world concepts including:

✔ Routing
✔ State Management
✔ CRUD operations
✔ Authentication Flow
✔ Frontend + Backend Integration

📄License

This project is for educational purposes only and not intended for commercial use.
