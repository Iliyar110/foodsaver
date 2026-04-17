import { useApp, View } from "@/store/useApp";
import { Home, Calendar, Trophy, Settings } from "lucide-react";

const tabs: { id: View; label: string; icon: any }[] = [
  { id: "hem", label: "Hem", icon: Home },
  { id: "planering", label: "Planering", icon: Calendar },
  { id: "poang", label: "Poäng", icon: Trophy },
  { id: "installningar", label: "Inställningar", icon: Settings },
];

const BottomNav = () => {
  const view = useApp((s) => s.view);
  const setView = useApp((s) => s.setView);

  return (
    <nav className="absolute bottom-0 left-0 right-0 ios-blur border-t border-border/50 bg-background/85 pb-5 pt-2">
      <div className="flex items-center justify-around px-2">
        {tabs.map((t) => {
          const active = view === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className="flex flex-1 flex-col items-center gap-1 py-1.5 transition-colors"
            >
              <Icon
                className={`h-6 w-6 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
