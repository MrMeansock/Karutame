import random
from flask import Flask, request
from flask_cors import CORS, cross_origin

from modules import db

app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'
app.debug = True

@app.route("/api/")
@cross_origin()
def apiInfo():
  return '''API options'''

@app.route("/api/songs",defaults={'amount':None})
@app.route('/api/songs/random',defaults={'amount':1})
@app.route("/api/songs/random/<int:amount>")
@cross_origin()
def getSongs(amount:int):
  if request.method == "GET":
    return db.filterSelect("Songs", request.args, amount)
  return """Invalid"""

@app.route("/api/cards",defaults={'amount':None})
@app.route('/api/cards/random',defaults={'amount':1})
@app.route("/api/cards/random/<int:amount>")
@cross_origin()
def randomCards(amount:int):
  if request.method == "GET":
    return db.filterSelect("Cards", request.args, amount)
  return """Invalid"""

if __name__ == '__main__':
  app.run()