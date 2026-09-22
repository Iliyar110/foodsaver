import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";

const SettingRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between px-4 py-3.5">
    <span className="text-[15px]">{label}</span>
    {children}
  </div>
);

const Toggle = ({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!on)}
    className={`relative h-[31px] w-[51px] rounded-full transition-colors ${
      on ? "bg-primary" : "bg-secondary"
    }`}
  >
    <span
      className={`absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform ${
        on ? "translate-x-[22px]" : "translate-x-[2px]"
      }`}
    />
  </button>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mt-6">
    <h2 className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
    </h2>

    <div className="divide-y divide-border rounded-2xl bg-card card-shadow mx-1">
      {children}
    </div>
  </section>
);

const Installningar = () => {
  const [warnDays, setWarnDays] = useState("1 dag");
  const [warnOpen, setWarnOpen] = useState(false);
  const [colorCoding, setColorCoding] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/user/1")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.warning_days !== undefined) {
          setWarnDays(
            data.warning_days === 1
              ? "1 dag"
              : `${data.warning_days} dagar`
          );
        }
      })
      .catch((err) =>
        console.error("Fel vid hämtning av varningsdagar:", err)
      );
  }, []);

  const options = ["1 dag", "2 dagar", "3 dagar"];

  const handleSave = async () => {
    const warningDays = parseInt(warnDays);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/1/warning-days?warning_days=${warningDays}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Kunde inte spara inställningarna");
      }

      toast.success("Inställningar sparade", {
        description: "Dina val är uppdaterade.",
      });
    } catch (error) {
      console.error("Fel vid sparning av inställningar:", error);

      toast.error("Kunde inte spara inställningarna", {
        description: "Försök igen.",
      });
    }
  };

  return (
    <div className="pb-28">
      <Header title="Mina Val" />

      <div className="pt-2">
        <Section title="Widget-inställningar">
          <div className="relative">
            <SettingRow label="Varna när mat går ut om:">
              <button
                onClick={() => setWarnOpen((o) => !o)}
                className="flex items-center gap-1 text-[15px] text-primary font-medium"
              >
                {warnDays}
                <ChevronDown className="h-4 w-4" />
              </button>
            </SettingRow>

            {warnOpen && (
              <div className="absolute right-3 top-12 z-20 w-40 overflow-hidden rounded-xl bg-popover shadow-lg ring-1 ring-border animate-scale-in">
                {options.map((o) => (
                  <button
                    key={o}
                    onClick={() => {
                      setWarnDays(o);
                      setWarnOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2.5 text-sm hover:bg-secondary"
                  >
                    {o}

                    {warnDays === o && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <SettingRow label="Färgkodning (Grön/Orange)">
            <Toggle on={colorCoding} onChange={setColorCoding} />
          </SettingRow>
        </Section>

        <Section title="Notiser">
          <SettingRow label="Tillåt push-notiser">
            <Toggle on={pushNotif} onChange={setPushNotif} />
          </SettingRow>
        </Section>

        <Section title="Gamification">
          <SettingRow label="Visa på Leaderboard">
            <Toggle on={showLeaderboard} onChange={setShowLeaderboard} />
          </SettingRow>
        </Section>

        <div className="px-5 pt-8">
          <button
            onClick={handleSave}
            className="w-full rounded-2xl bg-primary py-4 text-[15px] font-semibold text-primary-foreground active:scale-[0.98] transition-transform btn-glow"
          >
            Spara inställningar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Installningar;