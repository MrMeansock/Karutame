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

@app.route("/api/songs",defaults={'amount':None}, methods=['GET', 'POST'])
@app.route('/api/songs/random',defaults={'amount':1})
@app.route("/api/songs/random/<int:amount>")
@cross_origin()
def songs(amount:int):
  if request.method == "GET":
    return db.filterSelect(db.DB_TABLES['songs'], request.args, amount)
  if request.method == "POST":
    return db.createItem(db.DB_TABLES['songs'], request.args)
  return """Invalid request"""

@app.route("/api/cards",defaults={'amount':None}, methods=['GET', 'POST'])
@app.route('/api/cards/random',defaults={'amount':1})
@app.route("/api/cards/random/<int:amount>")
@cross_origin()
def cards(amount:int):
  if request.method == "GET":
    return db.filterSelect(db.DB_TABLES['cards'], request.args, amount)
  if request.method == "POST":
    return db.createItem(db.DB_TABLES['cards'], request.args)
  return """Invalid request"""

@app.route("/api/decks",defaults={'amount':None}, methods=['GET', 'POST'])
@cross_origin()
def decks(amount:int):
  if request.method == "GET":
    return db.filterSelect(db.DB_TABLES['decks'], request.args, amount)
  if request.method == "POST":
    return db.createItem(db.DB_TABLES['decks'], request.args)
  return """Invalid request"""

@app.route("/api/decks/<name>", methods=['GET', 'POST'])
@cross_origin()
def deckCardSongs(name:str):
  if request.method == "GET":
    return db.deckDetails(name=name)
  if request.method == "POST":
    return """Invalid request"""
  return """Invalid request"""

if __name__ == '__main__':
  app.run()