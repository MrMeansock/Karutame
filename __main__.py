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

@app.route("/api/songs",defaults={'anime':None})
@app.route("/api/songs/<anime>")
@cross_origin()
def songs(anime):
  if request.method == "GET":
    if anime:
      return db.getSongs(anime)
    return db.getAllSongs()
  return """Invalid"""

@app.route('/api/songs/random',defaults={'amount':1,'anime':None})
@app.route("/api/songs/random/<int:amount>",defaults={'anime':None})
@app.route("/api/songs/<anime>/random",defaults={'amount':1})
@app.route("/api/songs/<anime>/random/<int:amount>")
@cross_origin()
def randomSongs(anime, amount:int):
  if request.method == "GET":
    if anime:
      songs = db.getSongs(anime)
    else:
      songs = db.getAllSongs()
    if amount >= len(songs):
      amount = len(songs) - 1
    return random.sample(songs, amount)
  return """Invalid"""

@app.route("/api/cards",defaults={'anime':None})
@app.route("/api/cards/<anime>")
@cross_origin()
def cards(anime):
  if request.method == "GET":
    if anime:
      return db.getCards(anime)
    return db.getAllCards()
  return """Invalid"""

@app.route('/api/cards/random',defaults={'amount':1,'anime':None})
@app.route("/api/cards/random/<int:amount>",defaults={'anime':None})
@app.route("/api/cards/<anime>/random",defaults={'amount':1})
@app.route("/api/cards/<anime>/random/<int:amount>")
@cross_origin()
def randomCards(anime, amount:int):
  if request.method == "GET":
    if anime:
      cards = db.getCards(anime)
    else:
      cards = db.getAllCards()
    if amount >= len(cards):
      amount = len(cards) - 1
    return random.sample(cards, amount)
  return """Invalid"""

if __name__ == '__main__':
    app.run()