import Header from "@/components/Header";
import { useApp } from "@/store/useApp";
import { Plus, Sparkles, ShoppingBasket } from "lucide-react";
import { toast } from "sonner";

const missingIngredients = ["Ägg", "Kryddor"];

const Planering = () => {
  const shoppingList = useApp((s) => s.shoppingList);
  const addShopping = useApp((s) => s.addShopping);

  return (
    <div className="pb-28">
      <Header title="Veckans Räddare" />

      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Standardval: Veckans Räddare
        </div>

        <div className="mt-3 overflow-hidden rounded-3xl bg-card card-shadow animate-slide-up">
          <div className="relative h-44 bg-gradient-to-br from-amber-200 via-orange-300 to-amber-400">
            <div className="absolute inset-0 flex items-center justify-center text-7xl">
              🍳
            </div>
            <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-foreground backdrop-blur-sm">
              ⏱ 15 min · ⭐ 4.8
            </div>
          </div>

          <div className="p-5">
            <h2 className="text-xl font-bold leading-tight">
              Krämig Omelett med krutonger
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Snabb, mättande och räddar två varor.
            </p>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Räddar från kylen
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                🥛 Mjölk · Idag
              </span>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                🍞 Formfranska · Idag
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            addShopping(missingIngredients);
            toast.success("Tillagt i inköpslistan", {
              description: "Ägg & Kryddor är redo att handlas.",
            });
          }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-[15px] font-semibold text-primary-foreground active:scale-[0.98] transition-transform btn-glow"
        >
          <Plus className="h-5 w-5" strokeWidth={3} />
          Lägg till saknade ingredienser i inköpslista
        </button>

        <section className="mt-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ShoppingBasket className="h-3.5 w-3.5" />
            Inköpslista
          </div>

          <div className="mt-3 rounded-2xl bg-card card-shadow">
            {shoppingList.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-muted-foreground">
                Listan är tom. Lägg till ingredienser ovan.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {shoppingList.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 px-5 py-3.5 animate-scale-in"
                  >
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40" />
                    <span className="text-sm font-medium">{item}</span>
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
