import { Fragment } from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-1 text-sm text-slate-500",
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <Fragment key={`${index}-${item.label}`}>
            {index > 0 ? (
              <ChevronRight
                className="h-3.5 w-3.5 text-slate-400"
                aria-hidden="true"
              />
            ) : null}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="text-slate-500 transition-colors hover:text-slate-700"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={cn(
                  isLast ? "font-medium text-slate-900" : "text-slate-500",
                )}
              >
                {item.label}
              </span>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
