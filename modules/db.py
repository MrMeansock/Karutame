import random
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

def filterSelect(table, args, amount):
    sql = ["SELECT * FROM {}".format(table)]
    params = []
    if(len(args) > 0):
        sql[0] += " WHERE "
        for key in args:
            sql.append("{} = ?".format(key))
            params.append(args[key])
    
    request = sql[0] + ' AND '.join(sql[1:])
    result = query(request, params)
    if not amount:
      return result
    if amount >= len(result):
      amount = len(result) - 1
    return random.sample(result, amount)