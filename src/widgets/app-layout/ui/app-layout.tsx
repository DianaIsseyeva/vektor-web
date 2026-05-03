import { ClipboardList, LayoutDashboard, Menu, Package, Truck } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";

const navItems = [
  { label: "Overview", to: "/", icon: LayoutDashboard },
  { label: "Orders", to: routes.orders, icon: ClipboardList },
  { label: "Carriers", to: "/carriers", icon: Truck },
  { label: "Equipment", to: "/equipment", icon: Package },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-4 lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
            V
          </div>
          <div>
            <p className="font-semibold text-slate-950">Vektor</p>
            <p className="text-xs text-slate-500">Order Management</p>
          </div>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950",
                  isActive && "bg-blue-50 text-blue-700",
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <button className="rounded-2xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
              <Menu className="size-5" />
            </button>
            <div>
              <p className="text-sm text-slate-500">Dashboard</p>
              <h1 className="font-semibold text-slate-950">Orders</h1>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-600">
            Ronald R.
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
