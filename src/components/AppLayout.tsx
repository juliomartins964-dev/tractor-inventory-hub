import { NavLink, Outlet } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import logo from "@/assets/veneza-logo.png";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Entrada de Estoque", end: true },
  { to: "/pedidos", label: "Pedidos em Carteira" },
  { to: "/faturamento", label: "Faturamento RVD" },
];

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground border-b-4 border-accent">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-lg bg-white flex items-center justify-center shadow-md p-1 shrink-0">
              <img src={logo} alt="Veneza Máquinas — John Deere" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold leading-tight tracking-tight truncate">Veneza Máquinas</h1>
              <p className="text-[10px] sm:text-xs text-primary-foreground/80 truncate">Sistema de Gestão Agrícola</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur shrink-0">
            <CalendarDays className="h-4 w-4" />
            <span className="font-medium capitalize">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
            </span>
          </div>
        </div>
        <nav className="container mx-auto px-3 sm:px-6">
          <ul className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((t) => (
              <li key={t.to} className="shrink-0">
                <NavLink
                  to={t.to}
                  end={t.end}
                  className={({ isActive }) =>
                    cn(
                      "inline-block px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-all whitespace-nowrap",
                      isActive
                        ? "bg-background text-primary shadow-sm"
                        : "text-primary-foreground/85 hover:bg-white/10"
                    )
                  }
                >
                  {t.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6 max-w-[1600px]">
        <Outlet />
      </main>

      <footer className="text-center text-xs text-muted-foreground pt-2 pb-6">
        Veneza Máquinas © 2026 — Sistema de gestão de estoque agrícola
      </footer>
    </div>
  );
};
