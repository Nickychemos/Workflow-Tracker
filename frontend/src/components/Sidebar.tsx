import { Link, useLocation } from "react-router-dom"
import { ClipboardList, Workflow } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  {
    to: "/",
    label: "Applications",
    icon: ClipboardList,
    matches: (pathname: string) =>
      pathname === "/" || pathname.startsWith("/applications"),
  },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-slate-200 bg-slate-50 md:flex">
      <div className="flex h-14 items-center border-b border-slate-200 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-200 text-slate-700">
          <Workflow className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <div className="text-sm font-semibold text-slate-900">
            Workflow Tracker
          </div>
          <div className="text-xs text-slate-500">Application lifecycle</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive = item.matches(location.pathname)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "text-indigo-600 font-semibold"
                  : "text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-400">
        v1.0
      </div>
    </aside>
  )
}
