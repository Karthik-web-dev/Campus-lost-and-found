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
import requests

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
    
    def moderate_text(text):
          payload = {
               "model": "qwen2.5:7b-instruct-q4_K_M",
               "prompt": f"""
                   You are a content moderation system. Classify text as SAFE or UNSAFE.
                    - Unsafe content includes threats, harassment, hate speech, illegal activity, sexual exploitation, or self-harm instructions.
                    - Mild negative words like "awful", "stupid", or "dumb" are SAFE.
                    - Respond with only the label: SAFE, HATE, VIOLENCE, SEXUAL, SELF_HARM, ILLEGAL

                    Text:
                    \"{text}\"

                    Provide:
                    - The most appropriate label
                    - A Risk score between 0 and 1 for that label (based on the sentiment/context)
                              - 0 = completely safe
                              - 1 = completely unsafe
                    Output MUST be valid Python syntax.
                    Output MUST be exactly one Python list with two elements.
                    Do NOT output anything else.
                    Example valid output:
                              ["SAFE", 0.0] 
          """,
               "stream": False
          }
          # print(payload)

          r = requests.post("http://localhost:11434/api/generate", json=payload)
          # print(r.json()["response"].strip())
          return r.json()["response"].strip()

    @app.route('/api')
    def api():
        return jsonify({"message":"Hello World"})
    
    @app.route('/api/posts')
    def posts():
        posts = Posts.query.order_by(Posts.created_at.desc()).all()
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
        imageUrl = request.form.get("imageUrl")

        if imageUrl:
             image_url = imageUrl
        elif image:
             uploaded = cloudinary.uploader.upload(image)
             image_url = uploaded["secure_url"]
        else:
             return jsonify({"status":"failed", "message":"Image is compulsory"}), 400
        data = Posts(title=title, description=desc, 
                     type=types, location=loc, 
                     date=date, time=time, image_url=image_url, 
                     user_id=g.id, category=category)
        db.session.add(data)
        db.session.commit()
        return jsonify({"status":"success", "message":"Post created successfully"}), 200

    @app.route('/api/edit/<int:id>', methods=["POST"])
    @requires_login
    def edit_post(id):
        EDITABLE_FIELDS = {"title", "description", "location", "time", "category", "type", "date", "image_url"}

        post = Posts.query.filter_by(id = id, user_id = g.id).first_or_404()
        data = request.form.to_dict()
        image = request.files.get("image")
        if image: 
             uploaded = cloudinary.uploader.upload(image)
             image_url = uploaded["secure_url"]
             data['image_url'] = image_url

        for key in EDITABLE_FIELDS & data.keys():
          setattr(post, key, data[key])
        
        db.session.commit()
        return jsonify({"status":"success", "message":"Post edited successfully"}), 200
    
    @app.route('/api/me')
    @requires_login
    def me():
          user = Cred.query.filter_by(id=g.id).first()
          user1 = g.id

          # Fetch all conversations involving the user
          conversations = Conversations.query.filter(
               or_(Conversations.user1 == user1, Conversations.user2 == user1)
          ).order_by(Conversations.created_at.desc()).all()

          clients = []

          for conv in conversations:
               # Determine the other user
               other_user_id = conv.user2 if user1 == conv.user1 else conv.user1
               other_user = Cred.query.get(other_user_id)

               # Get post info for this conversation
               post = Posts.query.get(conv.post_id) if conv.post_id else None

               client_entry = {
                    "conversation_id": conv.id,
                    "id": other_user.id,
                    "name": other_user.name,
               }

               # Include post details if available
               if post:
                    client_entry["post"] = {
                         "id": post.id,
                         "title": post.title,
                         "description": post.description,
                         "image_url": post.image_url
                    }

               clients.append(client_entry)

          return jsonify({
               "status": "success",
               "message": "User is logged in.",
               "body": {
                    "id": user.id,
                    "loggedIn": True,
                    "name": user.name,
                    "clients": clients
               }
          }), 200

         
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
          print("handle_new_conversation, am i being used?")
          data = request.get_json()
          print(data)
          ids = [data['user1'], data['user2']]

          user1, user2 = sorted(ids)
          conv = Conversations.query.filter_by(user1=user1, user2=user2, post_id=data['post_id']).first()
          if not conv: 
               conv = Conversations(user1=user1, user2=user2, post_id=data['post_id'])
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
          messages = Message.query.filter_by(conversation_id=convId).order_by(Message.timestamp)

          data = [msg.to_dict() for msg in messages]

          conv = Conversations.query.get(convId)
          other_user_id = conv.user2 if session['user_id'] == conv.user1 else conv.user1
          other_user = Cred.query.get(other_user_id).to_dict()

          # Include post if it exists
          post = Posts.query.get(conv.post_id) if conv.post_id else None
          if post:
               other_user["post"] = {
                    "id": post.id,
                    "title": post.title,
                    "image_url": post.image_url,
                    "description": post.description
               }

          return {"messages": data, "client": other_user}


#     @socket.on("message")
#     def handle_incoming_message(data):
#          socket.start_background_task(process_message, data)
         
#     def process_message(data):
#          with app.app_context():
#           print(data)
#           [label, score] = eval(moderate_text(data['content']))
#           if (label != "SAFE" and score > 0.8):
#                message = f"*This message is deleted because: {label}*"
#                is_moderated = True
#           else:
#                message = data['content']  
#                is_moderated = False
#           new_message = Message(sender_id= data['sender_id'], content=message, conversation_id=data['conv_id'], is_moderated=is_moderated)
#           db.session.add(new_message)
#           db.session.commit()

#           new_message_dict = new_message.to_dict()
#           print("message processed!")
#           socket.emit("message", new_message_dict, room=f"conv_{data['conv_id']}")

    @socket.on("message")
    def handle_incoming_message(data):
     #     print(data)
         new_message = Message(sender_id= data['sender_id'], content=data['content'], conversation_id=data['conv_id'], 
                               is_moderated=False)
         db.session.add(new_message)
         db.session.commit()
         emit("message", new_message.to_dict(), room=f"conv_{data['conv_id']}")


    @socket.on("new_conversation")
    def handle_new_conversation_socket(data):
     sender_id = data["sender_id"]
     receiver_id = data["receiver_id"]
     conv_id = data["conv_id"]

     print("Reciever ID: ", receiver_id)
     emit("new_conversation_created", {"convId":f'conv_{conv_id}'}, room=f'user_{receiver_id}', include_self=False)
     emit("new_conversation_created", {"convId":f'conv_{conv_id}'}, room=f'user_{sender_id}')
    
    @socket.on("typing")
    def handle_user_typing(convId):
         emit("user_typing", {"convId":convId}, include_self=False, room=f'conv_{convId}')

    @socket.on("stop_typing")
    def handle_stop_user_typing(convId):
         emit("user_stopped_typing", {"convId":convId}, include_self=False, room=f'conv_{convId}')


