import sqlite3

conn = sqlite3.connect('stories.db')
cursor = conn.cursor()
cursor.execute('SELECT * FROM stories')
rows = cursor.fetchall()
print(f'Total stories in database: {len(rows)}')
print('\nStories:')
for row in rows:
    print(f'ID: {row[0]}')
    print(f'Content: {row[1][:50]}...')
    print(f'Author: {row[2]}')
    print(f'Date: {row[3]}')
    print('-' * 50)
conn.close()
