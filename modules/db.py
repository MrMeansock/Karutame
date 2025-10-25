import sqlite3

DB_PATH = "files\\Kuratame.db"

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def query(query:str, args = None):
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

def getAllSongs():
    return query("""SELECT * FROM Songs""") 

def getSongs(anime):
    return query("""SELECT * FROM Songs WHERE Card = ?""", (anime,))

def getAllCards():
    return query("""SELECT * FROM Cards""")     

def getCards(anime):
    return query("""SELECT * FROM Cards WHERE Card = ?""", (anime,))