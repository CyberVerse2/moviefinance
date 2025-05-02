import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const stackedButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-red-600 text-white shadow-stacked-button hover:bg-red-700 active:shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground shadow-stacked-button hover:bg-destructive/90 active:shadow-none",
        outline:
          "border border-input bg-background shadow-stacked-sm hover:bg-accent hover:text-accent-foreground active:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground shadow-stacked-button hover:bg-secondary/80 active:shadow-none",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        stacked:
          "bg-white border border-gray-200 shadow-stacked hover:shadow-stacked-md active:shadow-stacked-sm transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface StackedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof stackedButtonVariants> {
  asChild?: boolean
}

const StackedButton = React.forwardRef<HTMLButtonElement, StackedButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(stackedButtonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
StackedButton.displayName = "StackedButton"

export { StackedButton, stackedButtonVariants }
