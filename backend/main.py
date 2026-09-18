from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# Detta tillåter din React-app att prata med din Python-server
app.add_middleware(
    CORSMiddleware,
    # I en riktig app begränsar man detta, men bra för utveckling
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


@app.get("/")
def read_root():
    return {"message": "Hej från FoodSaver-servern!"}


@app.get("/api/fridge")
def get_fridge_items():
    conn = get_db_connection()
    cursor = conn.cursor()

    # SQL-trick: Hämta food_id men kalla den 'id', hämta food_name men kalla den 'name'
    cursor.execute("SELECT food_id AS id, food_name AS name, category, expiry_date AS expires_in FROM food")
    food_items = cursor.fetchall()

    conn.close()
    return food_items

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

@app.delete("/api/fridge/{item_id}")
def delete_food(item_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Radera varan från databasen där ID matchar
    cursor.execute("DELETE FROM food WHERE food_id = ?", (item_id,))
    
    # Glöm inte commit när du ändrar i databasen (DELETE/INSERT/UPDATE)
    conn.commit()
    conn.close()
    
    return {"message": f"Vara {item_id} är raderad"}

@app.get("/api/user/{user_id}")
def get_user(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Hämtar poäng och streak för användaren
    cursor.execute("SELECT total_points, mat_streak, username FROM user WHERE user_id = ?", (user_id,))
    user = cursor.fetchone()
    
    conn.close()
    return user

@app.put("/api/user/{user_id}/add_points")
def add_points(user_id: int, points: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Hämta användarens nuvarande poäng
    cursor.execute("SELECT total_points FROM user WHERE user_id = ?", (user_id,))
    user = cursor.fetchone()
    
    if user:
        # 2. Räkna ut den nya summan och uppdatera databasen
        new_total = user['total_points'] + points
        cursor.execute("UPDATE user SET total_points = ? WHERE user_id = ?", (new_total, user_id))
        conn.commit()
    
    conn.close()
    return {"message": "Poäng uppdaterade!"}