import wallpaper from "@/assets/wallpaper.jpg";
import { useApp } from "@/store/useApp";
import { AlertTriangle, MessageCircle, Image, Camera, Settings, Phone, Music, Map, Mail, Calendar, Cloud } from "lucide-react";

const iosApps = [
  { icon: Phone, name: "Telefon", color: "from-green-400 to-green-600" },
  { icon: MessageCircle, name: "Meddelanden", color: "from-green-300 to-green-500" },
  { icon: Mail, name: "Mail", color: "from-blue-400 to-blue-600" },
  { icon: Camera, name: "Kamera", color: "from-gray-600 to-gray-800" },
  { icon: Image, name: "Bilder", color: "from-pink-400 via-purple-400 to-blue-500" },
  { icon: Map, name: "Kartor", color: "from-emerald-300 to-teal-500" },
  { icon: Music, name: "Musik", color: "from-pink-500 to-red-500" },
  { icon: Calendar, name: "Kalender", color: "from-white to-gray-200" },
  { icon: Cloud, name: "Väder", color: "from-blue-300 to-blue-600" },
  { icon: Settings, name: "Inställningar", color: "from-gray-400 to-gray-600" },
];

const LockScreen = () => {
  const setView = useApp((s) => s.setView);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={wallpaper}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />

      {/* Status bar */}
      <div className="relative flex items-center justify-between px-7 pt-3 text-white text-[15px] font-semibold tracking-tight">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <span className="text-xs">●●●●</span>
          <span className="text-xs">5G</span>
          <span className="ml-1 text-xs">100%</span>
        </span>
      </div>

      {/* Date */}
      <div className="relative mt-6 text-center text-white drop-shadow-lg">
        <p className="text-sm font-medium opacity-90">Onsdag, 17 april</p>
      </div>

      {/* Widget + apps */}
      <div className="relative mt-8 px-6">
        <div className="grid grid-cols-4 gap-x-4 gap-y-6">
          {/* FoodSaver Widget — 2x2 */}
          <button
            onClick={() => setView("hem")}
            className="col-span-2 row-span-2 group relative aspect-square rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 p-4 text-left widget-shadow active:scale-[0.97] transition-transform animate-pulse-soft"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-white/25 p-1.5 backdrop-blur-sm">
                  <AlertTriangle className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-semibold text-white/90">FoodSaver</span>
              </div>
              <div className="mt-auto">
                <p className="text-base font-bold leading-tight text-white">
                  ⚠️ 2 varor går ut idag!
                </p>
                <p className="mt-1 text-xs font-medium text-white/95">
                  Mjölk, Bröd
                </p>
                <p className="mt-2 text-[11px] font-semibold text-white/90">
                  Klicka för att rädda! →
                </p>
              </div>
            </div>
          </button>

          {/* Standard apps */}
          {iosApps.slice(0, 4).map((app) => (
            <AppIcon key={app.name} {...app} />
          ))}

          {/* Label under widget */}
          <div className="col-span-2 -mt-4 text-center">
            <span className="text-[13px] font-medium text-white drop-shadow-md">
              FoodSaver
            </span>
          </div>

          {iosApps.slice(4).map((app) => (
            <AppIcon key={app.name} {...app} />
          ))}
        </div>
      </div>

      {/* Dock */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="ios-blur grid grid-cols-4 gap-4 rounded-3xl bg-white/20 px-4 py-3">
          {iosApps.slice(0, 4).map((app) => (
            <AppIcon key={`dock-${app.name}`} {...app} hideLabel />
          ))}
        </div>
      </div>
    </div>
  );
};

const AppIcon = ({
  icon: Icon,
  name,
  color,
  hideLabel,
}: {
  icon: any;
  name: string;
  color: string;
  hideLabel?: boolean;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-br ${color} shadow-md`}
    >
      <Icon className="h-7 w-7 text-white" strokeWidth={2} />
    </div>
    {!hideLabel && (
      <span className="text-[11px] font-medium text-white drop-shadow-md">
        {name}
      </span>
    )}
  </div>
);

export default LockScreen;
