import sqlite3


def create_tables():
    # 1. Skapa (eller öppna) databasfilen
    conn = sqlite3.connect('foodsaver.db')
    cursor = conn.cursor()

    # 2. Skapa tabellen för Användare (USER)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        gmail TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        total_points INTEGER DEFAULT 1250,
        mat_streak INTEGER DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # 3. Skapa tabellen för Matvaror (FOOD)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS food (
        food_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        food_name TEXT NOT NULL,
        category TEXT,
        expiry_date TEXT,
        added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        image_path TEXT,
        input_method TEXT,
        FOREIGN KEY(user_id) REFERENCES user(user_id)
    )
    ''')

    # Spara ändringarna och stäng kopplingen
    conn.commit()
    conn.close()
    print("Succé! Databasen och tabellerna är nu skapade.")


# Det här gör att koden körs när vi startar filen
if __name__ == "__main__":
    create_tables()
