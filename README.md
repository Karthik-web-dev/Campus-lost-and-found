


# 📦Lost and Found Management System
![Python Version](https://img.shields.io/badge/python-3.13.9-blue) ![React Version](https://img.shields.io/badge/react-19.2.0-blue) ![MySQL Version](https://img.shields.io/badge/MySQL-8.0-blue)

A web-based fullstack **Lost and Found Management System** designed for university campuses. Built using **Flask**, **SQLAlchemy**, and **MySQL** for backend and **React** for frontend, it provides a clean UI, user authentication, and an efficient workflow for managing item records. 
This project enables students and staff to report, track, and retrieve lost or found items easily. 


## 🚀 Tech Stack
### Frontend
- React
- CSS

### Backend
- Python Flask
- Flask-SQLAlchemy
- Flask-Migrate (Alembic)
- MySQL
- Flask-CORS
- JWT (JSON Web Tokens) for authentication
- Bcrypt for password hashing

### Other Tools
- dotenv (environmental variables)
- Git & GitHub

## Project Structure
```
Campus-lost-and-found/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── routes.py
│   ├── run.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md

```
## ⚙️Backend Setup (Flask)
1. Create Virtual Environment
```bash
	cd backend
	python -m venv venv
	venv\Scripts\activate 
```
(*Windows command prompt*)

2. Install Dependencies
```bash
pip install -r requirements.txt
```
3. Configure MySQL and JWT in `.env`
```
DATABASEURI = mysql+pymysql://username:password@localhost/lost_found
SECRETKEY = your_secret_key
```
4. Run Migrations

```bash
flask db init
```
(*run `flask db init` once*)
```bash
flask db migrate
flask db upgrade
```
5. Start Backend Server
```bash
flask run
```
Runs at http://localhost:5000

## 🖼️Frontend Setup (React)
1. Install Dependencies
```bash
cd frontend
npm install
```

2. Start React Dev Server
```bash
npm run dev
```
Runs at:
- http://localhost:5173 (Vite) 
- http://localhost:3000 (CRA)

## 🔗Connecting React with Flask
Use fetch to make all API calls to the backend.
```js
fetch('http://localhost:5000/api')
	.then(res => console.log(res.data))
```
Make sure CORS is enabled
```py
from flask_cors import CORS
CORS(app)
```

## 💾 Database Models

### Users Table
- `id` (PK)  
- `email`  
- `password_hash`  
- `prn`  
- `name`  
- `division`  

### Lost & Found Posts Table
- `id` (PK)  
- `title`  
- `description`  
- `type` (ENUM: `"lost"` | `"found"`)  
- `category`  
- `location`  
- `date`  
- `time`  
- `image_url`  
- `user_id`  
- `created_at` (IST timestamp)  

### Conversations Table
- `id` (PK)  
- `user1` (user id)  
- `user2` (user id)  
- `created_at` (IST timestamp)  

### Messages Table
- `id` (PK)  
- `conversation_id` (FK → conversations.id)  
- `sender_id` (FK → credentials.id)  
- `content`  
- `timestamp` (IST timestamp)  
- `is_read` (boolean)


## Features Implemented So Far
✔️ User Registration & login 

✔️ Create lost & found posts 

✔️ MySQL database with Flask-SQLAlchemy 

✔️ Backend model relationships 

✔️ Full CORS support 

✔️ Environmental variables using dotenv 

✔️ React frontend using CSS 

✔️ Image upload support via [Cloudinary](https://cloudinary.com) / [Imgur](https://imgur.com)

✔️ Real-time chat support between users  

## Screenshots
Coming soon...

## Author
**Akshay Karthik Akella** - *Project Creator / Maintainer* 

[![GitHub](https://img.shields.io/badge/GitHub-000?logo=github&logoColor=white&style=for-the-badge)](https://github.com/Karthik-web-dev)
