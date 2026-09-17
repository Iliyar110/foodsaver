import sqlite3

# Anslut till databasen
conn = sqlite3.connect('foodsaver.db')
cursor = conn.cursor()

# Lägg in tre testvaror med rätt kolumnnamn (food_name, category, expiry_date)
cursor.execute("INSERT INTO food (food_name, category, expiry_date) VALUES ('Mellanmjölk', 'Mejeri', '1')")
cursor.execute("INSERT INTO food (food_name, category, expiry_date) VALUES ('Formfranska', 'Bröd', '3')")
cursor.execute("INSERT INTO food (food_name, category, expiry_date) VALUES ('Äpplen', 'Frukt', '5')")

# Spara (commit) ändringarna och stäng!
conn.commit()
conn.close()

print("Test-mat inlagd i databasen!")