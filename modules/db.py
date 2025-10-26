import random
import sqlite3


DB_PATH = "files\\Kuratame.db"

def status(success, content = None):
    return {"SUCCESS":success, "CONTENT":content}

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def select(query:str, args = None):
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

def filterSelect(table, args, amount=None):
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

def createItem(table, args):
    sqliteConnection = sqlite3.connect(DB_PATH)
    sqliteConnection.row_factory = dict_factory
    cursor = sqliteConnection.execute('Select * from {}'.format(table))
    names = [description[0] for description in cursor.description]
    if not all(name in args for name in names):
        print("POST is missing args!\nGiven [{}]\nNeeded:{}".format(args.keys(), names))
        return status(False, content="POST is missing args!\nGiven [{}]\nNeeded:{}".format(args.keys(), names))
    columns = []
    values = []
    temp = []
    for key in args:
        columns.append(key)
        temp.append('?')
        values.append(args[key])
    existing = filterSelect(table, args)
    if len(existing["CONTENT"]) > 0:
        return status(False, content="{} Already exists in {}".format(args, table))
    sql = "INSERT INTO {}({}) VALUES ({})".format(table, ','.join(columns), ','.join(temp))
    print(sql)
    print(values)
    cursor.execute(sql, values)
    sqliteConnection.commit()
    return status(True)