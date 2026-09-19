from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# Detta tillåter din React-app att prata med din Python-server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hjälpfunktion för att koppla till databasen
def get_db_connection():
    conn = sqlite3.connect('foodsaver.db')
    # Gör att vi får ut datan i ett snyggt format (JSON-liknande)
    conn.row_factory = sqlite3.Row
    return conn


class Food(BaseModel):
    food_name: str


class ShoppingItem(BaseModel):
    item_name: str
    quantity: int = 1


@app.get("/")
def read_root():
    return {"message": "Hej från FoodSaver-servern!"}


# Hämta matvaror från kylskåpet
@app.get("/api/fridge")
def get_fridge_items():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT food_id AS id, food_name AS name, category, expiry_date AS expires_in FROM food"
    )
    food_items = cursor.fetchall()

    conn.close()
    return food_items


# Hämta varor från inköpslistan
@app.get("/api/shopping-list")
def get_shopping_list():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT shopping_id AS id, item_name, quantity
        FROM shopping_list
    """)

    shopping_items = cursor.fetchall()

    conn.close()
    return shopping_items


# Lägg till vara i inköpslistan
@app.post("/api/shopping-list")
def add_shopping_item(item: ShoppingItem):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO shopping_list (item_name, quantity) VALUES (?, ?)",
        (item.item_name, item.quantity)
    )

    conn.commit()
    conn.close()

    return {"message": "Vara tillagd i inköpslistan!"}


# Lägg till matvara i kylskåpet
@app.post("/api/fridge")
def add_food(food: Food):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO food (food_name) VALUES (?)",
        (food.food_name,)
    )

    conn.commit()
    conn.close()

    return {"message": "Matvaran sparades!"}


# Radera matvara från kylskåpet
@app.delete("/api/fridge/{item_id}")
def delete_food(item_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM food WHERE food_id = ?",
        (item_id,)
    )

    conn.commit()
    conn.close()

    return {"message": f"Vara {item_id} är raderad"}


# Hämta användare
@app.get("/api/user/{user_id}")
def get_user(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT total_points, mat_streak, username FROM user WHERE user_id = ?",
        (user_id,)
    )
    user = cursor.fetchone()

    conn.close()
    return user


# Lägg till poäng
@app.put("/api/user/{user_id}/add_points")
def add_points(user_id: int, points: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Hämta användarens nuvarande poäng
    cursor.execute(
        "SELECT total_points FROM user WHERE user_id = ?",
        (user_id,)
    )
    user = cursor.fetchone()

    if user:
        # 2. Räkna ut den nya summan och uppdatera databasen
        new_total = user['total_points'] + points

        cursor.execute(
            "UPDATE user SET total_points = ? WHERE user_id = ?",
            (new_total, user_id)
        )

        conn.commit()

    conn.close()

    return {"message": "Poäng uppdaterade!"}