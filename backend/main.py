from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Detta tillåter din React-app att prata med din Python-server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # I en riktig app begränsar man detta, men bra för utveckling
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hej från FoodSaver-servern!"}

@app.get("/api/fridge")
def get_fridge_items():
    # Detta är tillfällig data (mock data) innan vi kopplar på den riktiga databasen
    return [
        {"id": 1, "name": "Mellanmjölk", "category": "Mejeri", "expires_in": 1},
        {"id": 2, "name": "Formfranska", "category": "Bröd", "expires_in": 1},
        {"id": 3, "name": "Äpplen", "category": "Frukt", "expires_in": 5}
    ]