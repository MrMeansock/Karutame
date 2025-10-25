from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/api/")
@cross_origin()
def apiInfo():
  return '''API options'''

@app.route("/api/")
@cross_origin()
def apiInfo():
  return '''API options'''

if __name__ == '__main__':
    app.run()