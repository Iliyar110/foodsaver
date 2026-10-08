from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from typing import Optional

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
    expiry_date: Optional[str] = None  # NYTT: Tillåter att man skickar med ett datum


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
        "INSERT INTO food (food_name, expiry_date) VALUES (?, ?)",
        (food.food_name, food.expiry_date)
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
        "SELECT total_points, mat_streak, username, warning_days FROM user WHERE user_id = ?",
        (user_id,)
    )
    user = cursor.fetchone()

    conn.close()
    return user

# Spara användarens val av warning_days
@app.put("/api/user/{user_id}/warning-days")
def update_warning_days(user_id: int, warning_days: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE user SET warning_days = ? WHERE user_id = ?",
        (warning_days, user_id)
    )

    conn.commit()
    conn.close()

    return {"message": "Varningsdagar uppdaterade!"}


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

# Radera vara från inköpslistan när man checkar av den
@app.delete("/api/shopping-list/{item_id}")
def delete_shopping_item(item_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM shopping_list WHERE shopping_id = ?",
        (item_id,)
    )

    conn.commit()
    conn.close()

    return {"message": "Vara borttagen från inköpslistan"}

@app.get("/api/recommendations")
def get_recommendations():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Hämta all mat användaren har i kylen
    cursor.execute("SELECT food_name FROM food")
    fridge_items = [row['food_name'].lower() for row in cursor.fetchall()]
    
    # 2. Hämta alla recept
    cursor.execute("SELECT * FROM recipe")
    all_recipes = cursor.fetchall()
    
    ranked_recipes = []
    
    # 3. Jämför kylen mot varje recept
    for recipe in all_recipes:
        recipe_id = recipe['recipe_id']
        
        cursor.execute("SELECT ingredient_name FROM recipe_ingredient WHERE recipe_id = ?", (recipe_id,))
        required_ingredients = [row['ingredient_name'] for row in cursor.fetchall()]
        
        # Räkna ut vilka som saknas
        missing = [req for req in required_ingredients if req.lower() not in fridge_items]
            
        # Gör om till ett lexikon (dict) och spara hur många som saknas
        recipe_dict = dict(recipe)
        recipe_dict['missing'] = missing
        recipe_dict['missing_count'] = len(missing)
        ranked_recipes.append(recipe_dict)
            
    conn.close()
    
    # 4. Sortera listan så att receptet med minst saknade varor hamnar först!
    ranked_recipes.sort(key=lambda x: x['missing_count'])
    
    return ranked_recipes

# Hämta topplistan
@app.get("/api/leaderboard")
def get_leaderboard():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # ORDER BY total_points DESC sorterar från högsta till lägsta poäng
    cursor.execute("SELECT user_id, username, total_points FROM user ORDER BY total_points DESC")
    leaderboard = cursor.fetchall()
    
    conn.close()
    return leaderboard