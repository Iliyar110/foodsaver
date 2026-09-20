import sqlite3

conn = sqlite3.connect('foodsaver.db')
cursor = conn.cursor()

# 1. Töm de gamla tabellerna helt
cursor.execute("DELETE FROM recipe")
cursor.execute("DELETE FROM recipe_ingredient")

# 2. Lägg in Omelett
cursor.execute("INSERT INTO recipe (title, description, emoji, time, rating, gradient) VALUES ('Krämig Omelett med krutonger', 'Snabb, mättande och räddar två varor.', '🍳', '15 min', '4.8', 'from-amber-200 via-orange-300 to-amber-400')")
r1 = cursor.lastrowid
for item in ['Ägg', 'Kryddor', 'Mjölk']:
    cursor.execute("INSERT INTO recipe_ingredient (recipe_id, ingredient_name) VALUES (?, ?)", (r1, item))

# 3. Lägg in Fattiga Riddare
cursor.execute("INSERT INTO recipe (title, description, emoji, time, rating, gradient) VALUES ('Fattiga Riddare', 'Klassisk svensk efterrätt — pannkaksdoftande och gyllene.', '🥞', '10 min', '4.9', 'from-yellow-200 via-amber-300 to-orange-400')")
r2 = cursor.lastrowid
for item in ['Ägg', 'Kanel', 'Socker']:
    cursor.execute("INSERT INTO recipe_ingredient (recipe_id, ingredient_name) VALUES (?, ?)", (r2, item))

# 4. Lägg in Varma Mackor
cursor.execute("INSERT INTO recipe (title, description, emoji, time, rating, gradient) VALUES ('Varma Mackor med ost', 'Rostat bröd, smält ost och en skvätt mjölk i smeten.', '🥪', '8 min', '4.6', 'from-orange-200 via-amber-300 to-yellow-400')")
r3 = cursor.lastrowid
for item in ['Ost', 'Smör', 'Formfranska']:
    cursor.execute("INSERT INTO recipe_ingredient (recipe_id, ingredient_name) VALUES (?, ?)", (r3, item))

conn.commit()
conn.close()
print("Databasen är rensad och har nu exakt tre unika recept!")