import sqlite3

conn = sqlite3.connect('foodsaver.db')
cursor = conn.cursor()

# En lista med fejk-vänner och deras poäng
friends = [
    ('Anna', 'anna@test.com', 'hemligt', 1400, 7),
    ('Marcus', 'marcus@test.com', 'hemligt', 1100, 3),
    ('Elin', 'elin@test.com', 'hemligt', 950, 2)
]

# Lägg in allihop i user-tabellen
cursor.executemany(
    "INSERT INTO user (username, gmail, password_hash, total_points, mat_streak) VALUES (?, ?, ?, ?, ?)", 
    friends
)

conn.commit()
conn.close()
print("3 vänner tillagda i databasen!")