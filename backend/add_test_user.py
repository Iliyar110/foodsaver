import sqlite3

conn = sqlite3.connect('foodsaver.db')
cursor = conn.cursor()

# Skapar en testanvändare med 1250 poäng och 5 dagars streak
cursor.execute("INSERT INTO user (username, gmail, password_hash, total_points, mat_streak) VALUES ('Iliya', 'iliya@test.com', 'hemligt123', 1250, 5)")

conn.commit()
conn.close()

print("Testanvändare inlagd!")