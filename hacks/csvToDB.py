import sqlite3
import pandas
import argparse

def main():
    sqliteConnection = sqlite3.connect("Kuratame.db")
    df = pandas.read_csv(args.csv)
    df.to_sql(args.output, sqliteConnection, if_exists='append', index=False)

parser = argparse.ArgumentParser()
parser.add_argument("--csv")
parser.add_argument("--output")

args = parser.parse_args()
main()