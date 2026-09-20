import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Plus, Sparkles, ShoppingBasket, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Planering = () => {
  const [shoppingList, setShoppingList] = useState<any[]>([]);
  
  // NYTT: Nu sparar vi en array av recept och ett index, precis som i din originalkod
  const [recipes, setRecipes] = useState<any[]>([]);
  const [recipeIdx, setRecipeIdx] = useState(0);

  const fetchRecommendation = () => {
    fetch("http://127.0.0.1:8000/api/recommendations")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setRecipes(data);
        }
      })
      .catch(err => console.error("Kunde inte hämta recept:", err));
  };

  const fetchShoppingList = () => {
    fetch("http://127.0.0.1:8000/api/shopping-list")
      .then(res => res.json())
      .then(data => setShoppingList(data))
      .catch(err => console.error("Fel vid hämtning av inköpslista:", err));
  };

  // NYTT: Tar nu emot både id och namnet på varan
  const handleCheckItem = async (id: number, name: string) => {
    try {
      // 1. Skicka varan till kylen först (använder er befintliga POST för mat)
      await fetch("http://127.0.0.1:8000/api/fridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ food_name: name }),
      });

      // 2. Radera den sedan från inköpslistan
      await fetch(`http://127.0.0.1:8000/api/shopping-list/${id}`, { 
        method: "DELETE" 
      });
      
      // 3. Hämta den uppdaterade listan så varan försvinner från skärmen
      fetchShoppingList();
      
      // 4. Ge snygg feedback!
      toast.success(`${name} inlagd i kylen!`, {
        description: "Bra jobbat med inköpen.",
      });

    } catch (error) {
      console.error("Kunde inte flytta varan till kylen:", error);
    }
  };

  useEffect(() => {
    fetchRecommendation();
    fetchShoppingList();
  }, []);

  // Hämta det aktuella receptet baserat på indexet
  const recipe = recipes[recipeIdx];

  return (
    <div className="pb-28">
      <Header title="Veckans Räddare" />

      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Smarta Receptförslag
        </div>

        {!recipe ? (
          <div className="mt-3 rounded-3xl bg-card p-10 text-center card-shadow">
            <p className="text-muted-foreground animate-pulse">Leker mästerkock och letar recept...</p>
          </div>
        ) : (
          <>
            <div className="mt-3 overflow-hidden rounded-3xl bg-card card-shadow animate-slide-up">
              <div className={`relative h-44 bg-gradient-to-br ${recipe.gradient}`}>
                <div className="absolute inset-0 flex items-center justify-center text-7xl">
                  {recipe.emoji}
                </div>
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-foreground backdrop-blur-sm">
                  ⏱ {recipe.time} · ⭐ {recipe.rating}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold leading-tight">{recipe.title}</h2>
                  
                  {/* NYTT: Refresh-knappen är tillbaka! */}
                  {recipes.length > 1 && (
                    <button
                      onClick={() => {
                        setRecipeIdx((i) => (i + 1) % recipes.length);
                        toast("Byter recept", { description: "Hittade ett annat alternativ till dig." });
                      }}
                      aria-label="Slumpa nytt recept"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground active:scale-90 transition-transform"
                    >
                      <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  )}
                </div>
                
                <p className="mt-1 text-sm text-muted-foreground">{recipe.description}</p>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Saknas för detta recept:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {recipe.missing.length === 0 ? (
                    <span className="rounded-full bg-primary/20 text-primary px-3 py-1 text-xs font-semibold">
                      Du har allt som behövs! 🎉
                    </span>
                  ) : (
                    recipe.missing.map((item: string) => (
                      <span key={item} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                        {item}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={async () => {
                if (recipe.missing.length === 0) return;
                try {
                  for (const ingredient of recipe.missing) {
                    const response = await fetch("http://127.0.0.1:8000/api/shopping-list", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ item_name: ingredient, quantity: 1 }),
                    });
                    if (!response.ok) throw new Error("Kunde inte lägga till ingrediens");
                  }
                  fetchShoppingList();
                  toast.success("Tillagt i inköpslistan", {
                    description: `${recipe.missing.join(" & ")} är redo att handlas.`,
                  });
                } catch (error) {
                  toast.error("Något gick fel", { description: "Kunde inte spara ingredienserna." });
                }
              }}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-semibold active:scale-[0.98] transition-transform ${
                recipe.missing.length === 0 
                  ? "bg-secondary text-secondary-foreground opacity-50 cursor-not-allowed" 
                  : "bg-primary text-primary-foreground btn-glow"
              }`}
            >
              <Plus className="h-5 w-5" strokeWidth={3} />
              Lägg till saknade ingredienser i inköpslista
            </button>
          </>
        )}

        <section className="mt-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ShoppingBasket className="h-3.5 w-3.5" />
            Inköpslista
          </div>
          <div className="mt-3 rounded-2xl bg-card card-shadow">
            {shoppingList.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-muted-foreground">
                Listan är tom.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {shoppingList.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleCheckItem(item.id, item.item_name)}
                    className="flex cursor-pointer items-center gap-3 px-5 py-3.5 hover:bg-secondary/50 animate-scale-in"
                  >
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40 transition-colors hover:border-primary" />
                    <span className="text-sm font-medium">{item.item_name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Planering;