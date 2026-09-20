import sqlite3

conn = sqlite3.connect('foodsaver.db')
cursor = conn.cursor()

# Lägg till Recept 2: Fattiga Riddare
cursor.execute("""
    INSERT INTO recipe (title, description, emoji, time, rating, gradient) 
    VALUES ('Fattiga Riddare', 'Klassisk svensk efterrätt — pannkaksdoftande och gyllene.', '🥞', '10 min', '4.9', 'from-yellow-200 via-amber-300 to-orange-400')
""")
recipe_id_1 = cursor.lastrowid
for item in ['Ägg', 'Kanel', 'Socker']:
    cursor.execute("INSERT INTO recipe_ingredient (recipe_id, ingredient_name) VALUES (?, ?)", (recipe_id_1, item))

# Lägg till Recept 3: Varma Mackor
cursor.execute("""
    INSERT INTO recipe (title, description, emoji, time, rating, gradient) 
    VALUES ('Varma Mackor med ost', 'Rostat bröd, smält ost och en skvätt mjölk i smeten.', '🥪', '8 min', '4.6', 'from-orange-200 via-amber-300 to-yellow-400')
""")
recipe_id_2 = cursor.lastrowid
for item in ['Ost', 'Smör', 'Formfranska']:
    cursor.execute("INSERT INTO recipe_ingredient (recipe_id, ingredient_name) VALUES (?, ?)", (recipe_id_2, item))

conn.commit()
conn.close()
print("Nya, unika recept är nu tillagda i databasen!")