import { NavLink } from "react-router-dom"
import { ClipboardList } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Applications", icon: ClipboardList, end: true },
]

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="flex h-14 items-center border-b border-slate-200 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-sm font-semibold text-white">
          W
        </div>
        <div className="ml-3">
          <div className="text-sm font-semibold text-slate-900">
            Workflow Tracker
          </div>
          <div className="text-xs text-slate-500">Trendpro take-home</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        <div className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
          Workflow
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
        Junior to Mid Django and React take-home
      </div>
    </aside>
  )
}
