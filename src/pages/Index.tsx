import LockScreen from "@/components/LockScreen";
import BottomNav from "@/components/BottomNav";
import Hem from "@/views/Hem";
import Planering from "@/views/Planering";
import Poang from "@/views/Poang";
import Installningar from "@/views/Installningar";
import { useApp } from "@/store/useApp";

const Index = () => {
  const view = useApp((s) => s.view);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4 sm:p-8">
      {/* iPhone frame */}
      <div className="relative w-full max-w-[400px] aspect-[9/19.5] rounded-[3rem] bg-black p-[10px] shadow-2xl">
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-background">
          {/* Notch */}
          {view === "lockscreen" && (
            <div className="absolute left-1/2 top-2 z-30 h-6 w-28 -translate-x-1/2 rounded-full bg-black" />
          )}

          <div className="relative h-full overflow-y-auto">
            {view === "lockscreen" && <LockScreen />}
            {view === "hem" && <Hem />}
            {view === "planering" && <Planering />}
            {view === "poang" && <Poang />}
            {view === "installningar" && <Installningar />}
          </div>

          {view !== "lockscreen" && <BottomNav />}
        </div>
      </div>
    </div>
  );
};

export default Index;
