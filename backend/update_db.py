import sqlite3

conn = sqlite3.connect('foodsaver.db')
cursor = conn.cursor()

# Lägger till den saknade kolumnen i din databas
cursor.execute("ALTER TABLE user ADD COLUMN warning_days INTEGER DEFAULT 3")

conn.commit()
conn.close()
print("Fixat! Kolumnen 'warning_days' är tillagd i databasen.")