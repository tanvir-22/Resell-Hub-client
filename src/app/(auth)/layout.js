import { Navbar } from "@/components/Navbar";

export default function AuthLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 flex">
        {children}
      </main>
    </div>
  );
}
