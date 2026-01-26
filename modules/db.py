import random
import sqlite3
import uuid

from werkzeug.datastructures import MultiDict

DB_TABLES = {'decks':'Decks', 'cards':'Cards', 'songs':'Songs', 'deckDetails':'DeckCardSongs', 'cardDetails':'CardSongs'}
DB_PATH = "files\\Kuratame.db"

def status(success, content = None):
    if not success:
        print(content)
    return {"SUCCESS":success, "CONTENT":content}

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def select(query:str, args:MultiDict = None):
    sqliteConnection = sqlite3.connect(DB_PATH)
    sqliteConnection.row_factory = dict_factory
    cursor = sqliteConnection.cursor()
    if args:
        cursor.execute(query, args)
    else:
        cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    return result

def filterSelect(table, args:MultiDict, amount=None):
    sql = ["SELECT * FROM {}".format(table)]
    params = []
    if(len(args) > 0):
        sql[0] += " WHERE "
        for key in args:
            sql.append("{} = ?".format(key))
            params.append(args[key])
    
    request = sql[0] + ' AND '.join(sql[1:])
    result = select(request, params)
    if not amount:
      return status(True, content=result)
    if amount >= len(result):
      amount = len(result) - 1
    return status(True, content=random.sample(result, amount))

def getID(table, name):
    sql = "SELECT uuid FROM {} WHERE name = ?".format(table)
    item = select(sql, [name])
    if len(item) != 1:
        return None
    return item[0]['uuid']

def getItem(table, uuid):
    sql = "SELECT * FROM {} WHERE uuid = ?".format(table)
    return select(sql, [uuid])

def deckDetails(deckID):
    result=[]
    sql = "SELECT card_song_id FROM {} WHERE deck_id = ?".format(DB_TABLES['deckDetails'])
    cardsInDeck = select(sql, [deckID])

    for card in cardsInDeck:        
        cardDetails = getItem(DB_TABLES['cardDetails'], card['card_song_id'])
        for item in cardDetails:
            card = getItem(DB_TABLES['cards'], item['card_id'])
            song = getItem(DB_TABLES['songs'], item['song_id'])
            result.append({'card':card[0], 'song':song[0]})
    return status(True, content=result)

def createItem(table, args:MultiDict):
    #load data
    sqliteConnection = sqlite3.connect(DB_PATH)
    sqliteConnection.row_factory = dict_factory
    cursor = sqliteConnection.execute('Select * from {}'.format(table))
    names = [description[0] for description in cursor.description]

    #data validation
    if 'uuid' in args.keys():
        return status(False, content="POST contains UUID! Do not manually add UUID.\nGiven [{}]".format(args.keys()))
    args.add('uuid', '')
    if not all(name in args for name in names):
        return status(False, content="POST is missing args!\nGiven [{}]\nNeeded:{}".format(args.keys(), names))
    args.pop('uuid')
    existing = filterSelect(table, args)
    if len(existing["CONTENT"]) > 0:
        return status(False, content="{} Already exists in {}".format(args, table))

    #create db entry
    columns = ['uuid']
    values = [str(uuid.uuid4())]
    temp = ['?']
    for key in args:
        columns.append(key)
        temp.append('?')
        values.append(args[key])

    #insert data
    sql = "INSERT INTO {}({}) VALUES ({})".format(table, ','.join(columns), ','.join(temp))
    cursor.execute(sql, values)
    sqliteConnection.commit()
    return status(True)