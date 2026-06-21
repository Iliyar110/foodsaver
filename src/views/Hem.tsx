import { useState } from "react";
import Header from "@/components/Header";
import ScanModal from "@/components/ScanModal";
import { useApp } from "@/store/useApp";
import { AlertTriangle, Check, Trash2, ScanLine } from "lucide-react";
import { toast } from "sonner";

const expiryLabel = (d: number) =>
  d <= 0 ? "Idag" : d === 1 ? "Idag" : `Om ${d - 1} dagar`;

const Hem = () => {
  const fridge = useApp((s) => s.fridge);
  const consume = useApp((s) => s.consume);
  const trash = useApp((s) => s.trash);
  const [scanOpen, setScanOpen] = useState(false);

  const expiringToday = fridge.filter((i) => i.daysToExpiry <= 1).length;

  return (
    <div className="pb-28">
      <Header title="Min Kyl" />

      <div className="px-5 pt-4">
        {expiringToday > 0 && (
          <div className="flex items-center gap-3 rounded-2xl bg-warning-bg px-4 py-3 animate-slide-up">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning" strokeWidth={2.5} />
            <p className="text-sm font-semibold text-foreground">
              {expiringToday} varor går ut idag!
            </p>
          </div>
        )}

        <div className="mt-5 space-y-3">
          {fridge.length === 0 && (
            <div className="rounded-2xl bg-card px-5 py-10 text-center card-shadow">
              <p className="text-2xl">🎉</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Kylen är tom! Bra jobbat.
              </p>
            </div>
          )}

          {fridge.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-card p-4 card-shadow animate-scale-in"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-2xl">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold leading-tight">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.category} · Går ut: {expiryLabel(item.daysToExpiry)}
                  </p>
                </div>
                {item.daysToExpiry <= 1 && (
                  <span className="rounded-full bg-warning-bg px-2 py-0.5 text-[10px] font-semibold text-warning">
                    SNART
                  </span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    consume(item.id);
                    toast.success("Bra jobbat! +50 poäng", {
                      description: `${item.name} markerad som uppäten.`,
                    });
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground active:scale-[0.97] transition-transform btn-glow"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                  Ätit upp
                </button>
                <button
                  onClick={() => {
                    trash(item.id);
                    toast(`${item.name} kastad`, {
                      description: "Försök rädda den nästa gång.",
                    });
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-secondary py-3 text-sm font-semibold text-secondary-foreground active:scale-[0.97] transition-transform"
                >
                  <Trash2 className="h-4 w-4" />
                  Kastat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating scan button */}
      <button
        onClick={() => setScanOpen(true)}
        className="absolute bottom-24 right-5 z-40 flex items-center gap-2 rounded-full bg-primary pl-4 pr-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_rgba(16,185,129,0.45)] active:scale-95 transition-transform"
      >
        <ScanLine className="h-5 w-5" strokeWidth={2.5} />
        Skanna vara
      </button>

      {scanOpen && <ScanModal onClose={() => setScanOpen(false)} />}
    </div>
  );
};

export default Hem;
