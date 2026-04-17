import Header from "@/components/Header";
import { useApp } from "@/store/useApp";
import { Flame, Trophy } from "lucide-react";

const Poang = () => {
  const score = useApp((s) => s.score);
  const streak = useApp((s) => s.streak);

  const leaderboard = [
    { name: "Anna", points: 1400 },
    { name: "DU", points: score, you: true },
    { name: "Marcus", points: 1100 },
    { name: "Elin", points: 950 },
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="pb-28">
      <Header title="Mina Framsteg" />

      <div className="px-5 pt-4">
        {/* Streak hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 p-6 text-white widget-shadow animate-slide-up">
          <div className="absolute -right-4 -top-4 text-[140px] opacity-20">
            🔥
          </div>
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
              Din Mat-Streak
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-6xl font-bold tracking-tight">{streak}</span>
              <span className="text-xl font-bold">DAGAR</span>
              <Flame className="h-7 w-7 fill-white" />
            </div>
            <p className="mt-2 text-sm opacity-95">
              Fortsätt så för att slå ditt rekord!
            </p>
          </div>
        </div>

        {/* Points */}
        <div className="mt-4 rounded-3xl bg-card p-5 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Totala poäng
              </p>
              <p className="mt-1 text-4xl font-bold tracking-tight text-primary tabular-nums">
                {score.toLocaleString("sv-SE")}
              </p>
              <p className="text-sm text-muted-foreground">poäng</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
              <Trophy className="h-7 w-7 text-primary" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <section className="mt-6">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Topplista — Vänner
          </h2>
          <div className="mt-3 overflow-hidden rounded-2xl bg-card card-shadow">
            {leaderboard.map((row, i) => (
              <div
                key={row.name}
                className={`flex items-center gap-4 border-b border-border last:border-b-0 px-4 py-3.5 ${
                  row.you ? "bg-accent" : ""
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    i === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : row.you
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`flex-1 text-base font-semibold ${
                    row.you ? "text-primary" : ""
                  }`}
                >
                  {row.name}
                </span>
                <span
                  className={`text-sm font-bold tabular-nums ${
                    row.you ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {row.points.toLocaleString("sv-SE")}p
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Poang;
