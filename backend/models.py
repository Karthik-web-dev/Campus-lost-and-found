from app import db
from datetime import datetime
from zoneinfo import ZoneInfo #for python 3.9+

IST = ZoneInfo("Asia/Kolkata")

class Posts(db.Model):
    __tablename__ = 'lost_found_posts'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    type = db.Column(db.Enum("lost", "found", name="type_enum"), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    image_url = db.Column(db.String(255))
    category = db.Column(db.String(15), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(IST), nullable=False)

    def to_dict(self):
        data = {
            "title":self.title,
            "description":self.description,
            "type":self.type,
            "category":self.category,
            "location":self.location,
            "date":self.date.isoformat(),
            "time":str(self.time),
            "image_url":self.image_url,
            "created_at":self.created_at.isoformat(),
            "id":self.id,
            "user_id":self.user_id
        }
        return data
    
class Cred(db.Model):
    __tablename__ = "credentials"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    prn = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(50))
    division = db.Column(db.String(10))

    def to_dict(self):
        data = {
            "id":self.id,
            "email":self.email,
            "prn":self.prn,
            "name":self.name,
            "division":self.division
        }
        return data

class Conversations(db.Model):
    __tablename__ = "conversations"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user1 = db.Column(db.Integer, nullable=False)
    user2 = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(IST), nullable=False)

class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey("conversations.id"), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey("credentials.id"), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey("credentials.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(IST), nullable=False)
    is_read = db.Column(db.Boolean, default=False)