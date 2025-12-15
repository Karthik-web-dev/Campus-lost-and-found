from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os
from flask_socketio import SocketIO

db = SQLAlchemy()
load_dotenv()
socket = SocketIO(cors_allowed_origins="http://localhost:5173")

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASEURI")
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
    db.init_app(app)

    socket.init_app(app)

    bcrypt = Bcrypt(app)

    from routes import register_routes
    register_routes(app, db, bcrypt, socket)

    migrate = Migrate(app, db)
    return app