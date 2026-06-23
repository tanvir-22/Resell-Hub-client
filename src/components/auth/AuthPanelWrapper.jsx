export function AuthPanelWrapper({ children }) {
  return (
    <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 relative overflow-hidden flex-col justify-center p-12 xl:p-16">
      <div className="animate-blob absolute -top-24 -right-24 w-72 h-72 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="animate-blob animation-delay-2s absolute bottom-0 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="animate-blob animation-delay-4s absolute top-1/2 right-1/4 w-48 h-48 bg-teal-600/15 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10 max-w-sm">{children}</div>
    </div>
  );
}
