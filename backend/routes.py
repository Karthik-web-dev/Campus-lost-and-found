from flask import jsonify, request, g, session 
from sqlalchemy import func, or_
from models import Posts, Cred, Conversations, Message
from functools import wraps
import jwt
from dotenv import load_dotenv
import os
import datetime
import cloudinary
import cloudinary.uploader
from flask_socketio import emit, send, join_room, leave_room

load_dotenv()

def register_routes(app, db, bcrypt, socket):
    cloudinary.config(
          cloud_name=os.getenv("CLOUD_NAME"),
          api_key=os.getenv("CLOUDINARY_API_KEY"),
          api_secret=os.getenv("CLOUDINARY_API_SECRET")
     )


    def create_token(id):
        payload = {"id":id, "exp":datetime.datetime.utcnow() + datetime.timedelta(hours = 1)}
        encoded = jwt.encode(payload, os.getenv('SECRETKEY'), algorithm="HS256")
        return encoded

    def check_token(token):         
        try:
                decoded = jwt.decode(token, os.getenv("SECRETKEY"), algorithms=["HS256"])
               #  print(decoded)
        except jwt.ExpiredSignatureError:
                return None, "Token Expired"
        except jwt.InvalidTokenError:
                return None, "Token Invalid" 
        return decoded, None
    
    def requires_login(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
           auth = request.cookies.get("access_token")
          #  print(auth)
           if not auth:
               return jsonify({"status":"failed", "message":"Login to make a post!"}), 401
           
           decoded, error = check_token(auth)
           if error:
                return jsonify({"status":"failed", "message":error}), 401
           g.id = decoded['id']
           return f(*args, **kwargs)
        return wrapper

    @app.route('/api')
    def api():
        return jsonify({"message":"Hello World"})
    
    @app.route('/api/posts')
    def posts():
        posts = Posts.query.all()
        data = [post.to_dict() for post in posts]
        for post in data:
             username = Cred.query.filter_by(id=post['user_id']).first().name
             post['name'] = username
        res = {"status":"success", "message":"Data retrieved.", "body":data}
        return jsonify(res), 200

    @app.route('/api/post/<int:id>')
    def view_post(id):
         post = Posts.query.filter_by(id=id).first()
         if not post:
              return jsonify({"status":"failed", "message":"No post found!"}), 404
         
         author = Cred.query.filter_by(id=post.user_id).first()
         return jsonify({"status":"success", "message":"Post fetched successfully", "body":{"post":post.to_dict(), "author":author.to_dict()}}), 200
    
    
    @app.route('/api/create', methods=["POST"])
    @requires_login
    def create_post():
        title = request.form.get("title")
        desc = request.form.get("desc")
        loc = request.form.get("loc")
        time = request.form.get("time")
        category = request.form.get("category")
        types = request.form.get("type")
        date = request.form.get("date")
        image = request.files.get("image")

        if image:
             uploaded = cloudinary.uploader.upload(image)
             image_url = uploaded["secure_url"]
        else:
             return jsonify({"status":"failed", "message":"Image is compulsory"}), 404
        data = Posts(title=title, description=desc, 
                     type=types, location=loc, 
                     date=date, time=time, image_url=image_url, 
                     user_id=g.id, category=category)
        db.session.add(data)
        db.session.commit()
        return jsonify({"status":"success", "message":"Post created successfully"}), 200
    
    @app.route('/api/me')
    @requires_login
    def me():
        user = Cred.query.filter_by(id = g.id).first()
        user1 = g.id
        conversations = Conversations.query.filter(or_(Conversations.user1==user1, Conversations.user2==user1)).order_by(Conversations.created_at.desc()).all()

        conv_user_list = []
        for conversation in conversations:
             other_user_id = conversation.user2 if user1==conversation.user1 else conversation.user1
             conv_user_list.append({**Cred.query.filter_by(id=other_user_id).first().to_dict(), "conversation_id":conversation.id})
        print(conv_user_list)
        
        return jsonify({"status":"success", "message":"User is logged in.", "body":{"id":user.id,"loggedIn":True, "name":user.name, "clients":conv_user_list}}), 200
         
    @app.route('/api/signup', methods=["POST"])
    def signup():
        data = request.get_json()
        user = Cred.query.filter_by(email=func.lower(data['email'])).first()
        if not data['email'] or not data['prn'] or not data['name'] or not data['class']:
             return jsonify({"status":"failed", "message":"Enter all details!"}), 400
        elif user is not None:
             return jsonify({"status":"failed", "message":"User already exists."}), 400
        
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        data = Cred(email=func.lower(data['email']), password_hash=hashed_password, name=data['name'], prn=data['prn'], division=data['class'])
        db.session.add(data)
        db.session.commit()
        return jsonify({"status":"success", "message":"Sign up successful!"}), 200

    @app.route('/api/login', methods=["POST"])
    def login():
         data = request.get_json()
         user = Cred.query.filter_by(email=func.lower(data['email'])).first()
         if not data['email']:
              return jsonify({"status":"failed", "message":"Enter all details."}), 400
         elif user is None:
              return jsonify({"status":"failed", "message":"User does not exist."}), 404
         else:
              sent_password = data['password']
              saved_password = user.password_hash
              check = bcrypt.check_password_hash(saved_password, sent_password)

              if not check:
                   return jsonify({"status":"failed", "message":"Incorrect Password."}), 401
              else:
                   token = create_token(user.id)
                   response = jsonify({"status":"success", "message":"User logged in successfully."})
                   response.set_cookie("access_token", token, httponly=True, secure=False, samesite="Lax", max_age=60*60*1) #For 1 hour
                   return response, 200
     
    @app.route('/api/logout')
    def logout():
          response = jsonify({"status":"success", "message":"User logged out successfully."})
          response.set_cookie("access_token", "", httponly=True, secure=False, samesite="Lax")
          return response, 200
    
    @app.route('/api/conversations/new', methods=["POST"])
    @requires_login
    def handle_new_conversation():
          data = request.get_json()
          print(data)
          ids = [data['user1'], data['user2']]

          user1, user2 = sorted(ids)
          conv = Conversations.query.filter_by(user1=user1, user2=user2).first()
          if not conv: 
               conv = Conversations(user1=user1, user2=user2)
               db.session.add(conv)
               db.session.commit()

          return jsonify({"status":"Success", "conversation_id":conv.id})       

     # SOCKETIO EVENTS
    @socket.on("connect")
    def handle_connection():
         token = request.cookies.get("access_token")
         if not token:
              return False
         
         decoded,error = check_token(token)
         if error:
              print(error)
         session['user_id'] = decoded['id']
         join_room(f'user_{session['user_id']}')
         print(f"User connected with ID: ", f'user_{session['user_id']}')
         print("User joined self room of ID: ", f'user_{session['user_id']}')

    @socket.on("joinRoom")
    def handle_join_room(convId):
         join_room(f'conv_{convId}')
         print("User joined room ID: ", convId)
         messages = Message.query.filter_by(conversation_id=convId).order_by(Message.timestamp)

         data = []
         for message in messages:
              data.append(message.to_dict())

         conv = Conversations.query.get(convId)
         other_user_id = conv.user2 if session['user_id'] == conv.user1 else conv.user1
         other_user = Cred.query.get(other_user_id).to_dict()
         return {"messages":data, "client":other_user}

    @socket.on("message")
    def handle_incoming_message(data):
         print(data)
         new_message = Message(sender_id= data['sender_id'], content=data['content'], conversation_id=data['conv_id'])
         db.session.add(new_message)
         db.session.commit()
         emit("message", new_message.to_dict(), room=data['conv_id'])


    @socket.on("new_conversation")
    def handle_new_conversation(data):
     sender_id = data["sender_id"]
     receiver_id = data["receiver_id"]
     conv_id = data["conv_id"]

     print(receiver_id)
     emit("new_conversation_created", {"convId":conv_id}, room=f'user_{receiver_id}', include_self=False)
     emit("new_conversation_created", {"convId":conv_id}, room=f'user_{sender_id}', include_self=False)
    
    @socket.on("typing")
    def handle_user_typing(convId):
         emit("user_typing", {"convId":convId}, include_self=False, room=f'conv_{convId}')

    @socket.on("stop_typing")
    def handle_user_typing(convId):
         emit("user_stopped_typing", {"convId":convId}, include_self=False, room=f'conv_{convId}')


