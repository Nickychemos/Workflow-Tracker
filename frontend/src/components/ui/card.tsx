import { forwardRef, type HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-slate-200 bg-white",
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = "Card"

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-1 border-b border-slate-100 px-[18px] py-[14px]",
      className,
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-sm font-semibold uppercase tracking-wide text-slate-700",
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 py-5", className)} {...props} />
))
CardContent.displayName = "CardContent"

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4",
      className,
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"
