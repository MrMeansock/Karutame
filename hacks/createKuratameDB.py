import os
import sqlite3
import uuid
import pandas
import argparse

def main():
    if os.path.exists(args.output):
        os.remove(args.output)
    #Load CSV files
    cardsDF = pandas.read_csv(args.cards)
    cardsDF['uuid'] = [str(uuid.uuid4()) for _ in range(len(cardsDF.index))]
    
    songsDF = pandas.read_csv(args.songs)
    songsDF['uuid'] = [str(uuid.uuid4()) for _ in range(len(songsDF.index))]

    deckDF = pandas.DataFrame(columns=['uuid', 'name'])
    allDeckID = str(uuid.uuid4())
    deckDF.loc[-1] = [allDeckID, "All"]

    #Create Junction tables
    cardSongDF = pandas.DataFrame(columns=['uuid', 'card_id', 'song_id'])
    deckCardSongDF = pandas.DataFrame(columns=['uuid', 'deck_id', 'card_song_id'])

    for index, row in songsDF.iterrows():
        cardMatch = (cardsDF.loc[cardsDF['name'] == row['card']]).iloc[0]
        if not cardMatch.empty:
            cardSongID = str(uuid.uuid4())
            cardSongDF.loc[-1] = [cardSongID, cardMatch['uuid'], row['uuid']]
            cardSongDF.index = cardSongDF.index + 1
            cardSongDF = cardSongDF.sort_index()
            deckCardSongDF.loc[-1] = [str(uuid.uuid4()), allDeckID, cardSongID]
            deckCardSongDF.index = deckCardSongDF.index + 1
            deckCardSongDF = deckCardSongDF.sort_index()

    #Clean up inputs
    cardsDF = cardsDF[cardsDF.columns.intersection(['uuid', 'name', 'image', 'tags'])]
    songsDF = songsDF[songsDF.columns.intersection(['uuid', 'name', 'link', 'tags'])]

    #Create DB file
    sqliteConnection = sqlite3.connect(args.output)
    cardsDF.to_sql('Cards', sqliteConnection, if_exists='append', index=False)
    songsDF.to_sql('Songs', sqliteConnection, if_exists='append', index=False)
    deckDF.to_sql('Decks', sqliteConnection, if_exists='append', index=False)
    cardSongDF.to_sql('CardSongs', sqliteConnection, if_exists='append', index=False)
    deckCardSongDF.to_sql('DeckCardSongs', sqliteConnection, if_exists='append', index=False)

parser = argparse.ArgumentParser()
parser.add_argument("--cards")
parser.add_argument("--songs")
parser.add_argument("--output", default='Kuratame-test.db')

args = parser.parse_args()
main()