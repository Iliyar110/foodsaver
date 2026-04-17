const Header = ({ title }: { title: string }) => (
  <header className="ios-blur sticky top-0 z-10 border-b border-border/50 bg-background/85 px-5 pb-3 pt-3">
    <div className="flex items-center justify-between text-[15px] font-semibold">
      <span>9:41</span>
      <span className="text-xs opacity-70">●●●●● 5G</span>
    </div>
    <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight">
      {title}
    </h1>
  </header>
);

export default Header;
