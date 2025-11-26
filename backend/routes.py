from flask import jsonify, request, g
from sqlalchemy import func
from models import Posts, Cred
from functools import wraps
import jwt
from dotenv import load_dotenv
import os
import datetime

load_dotenv()

def register_routes(app, db, bcrypt):
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
        g.id = decoded['id'] 
        return decoded, None
    
    def requires_login(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
           auth = request.cookies.get("access_token")
          #  print(auth)
           if not auth:
               return jsonify({"status":"failed", "message":"Token Cookie not found"}), 401
           
           decoded, error = check_token(auth)
           if error:
                return jsonify({"status":"failed", "message":error}), 401
           return f(*args, **kwargs)
        return wrapper

    @app.route('/api')
    def api():
        return jsonify({"message":"Hello World"})
    
    @app.route('/api/posts')
    def posts():
        posts = Posts.query.all()
        print(posts)
        data = [post.to_dict() for post in posts]
        res = {"status":"success", "message":"Data retrieved.", "body":data}
        return jsonify(res), 200
    
    @app.route('/api/create', methods=["POST"])
    @requires_login
    def create_post():
        data = request.get_json()
        Data = Posts(title=data['title'])
        db.session.add(Data)
        db.session.commit()
        return data
    
    @app.route('/api/me')
    def me():
         auth = request.cookies.get("access_token")
         if not auth:
              return jsonify({"status":"failed", "message":"Token not found", "body":{"user_id":None, "loggedIn":False}})
         decoded, error = check_token(auth)
         if error:
              return jsonify({"status":"failed", "message":error, "body":{"user_id":None,"loggedIn":False}})
         else: 
              return jsonify({"status":"success", "message":"User is logged in.", "body":{"user_id":decoded['id'],"loggedIn":True}})
         

    @app.route('/api/signup', methods=["POST"])
    def signup():
        data = request.get_json()
        user = Cred.query.filter_by(email=func.lower(data['email']))
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
     
    @app.route('/api/view', methods=["POST"])
    @requires_login
    def view():
         return "Hello world"
