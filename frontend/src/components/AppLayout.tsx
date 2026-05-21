import { Outlet, useLocation } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Sidebar } from "./Sidebar"

export function AppLayout() {
  const location = useLocation()
  const isListPage = location.pathname === "/"

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main
        className={cn(
          "px-6 py-6 md:ml-60",
          isListPage ? "bg-white" : "bg-slate-50",
        )}
      >
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
