from app import create_app, socket

flask_app = create_app()

if __name__ == '__main__':
    socket.run(flask_app, '0.0.0.0', debug=True, port=5000)