from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

PORT = int(os.getenv('FLASK_PORT', 5003))
DEBUG = os.getenv('FLASK_DEBUG', 'False') == 'True'

# Health check route
@app.route('/')
def index():
    return jsonify({ 'message': 'ML Service is running! 🤖' })

if __name__ == '__main__':
    app.run(port=PORT, debug=DEBUG)