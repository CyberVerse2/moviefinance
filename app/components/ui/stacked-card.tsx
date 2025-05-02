import * as React from "react"
import { cn } from "@/lib/utils"

const StackedCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-stacked hover:shadow-stacked-md transition-shadow duration-200",
        className,
      )}
      {...props}
    />
  ),
)
StackedCard.displayName = "StackedCard"

const StackedCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
StackedCardHeader.displayName = "StackedCardHeader"

const StackedCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
StackedCardTitle.displayName = "StackedCardTitle"

const StackedCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
StackedCardDescription.displayName = "StackedCardDescription"

const StackedCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
StackedCardContent.displayName = "StackedCardContent"

const StackedCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
StackedCardFooter.displayName = "StackedCardFooter"

export {
  StackedCard,
  StackedCardHeader,
  StackedCardFooter,
  StackedCardTitle,
  StackedCardDescription,
  StackedCardContent,
}
