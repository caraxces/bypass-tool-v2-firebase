import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ease-macos focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-hover shadow-macos hover:shadow-macos-hover transform hover:scale-105 active:scale-95",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-macos hover:shadow-macos-hover transform hover:scale-105 active:scale-95",
        outline: "border border-border bg-transparent hover:bg-background hover:text-foreground shadow-macos hover:shadow-macos-hover transform hover:scale-105 active:scale-95",
        secondary: "bg-background text-foreground hover:bg-background-secondary shadow-macos hover:shadow-macos-hover transform hover:scale-105 active:scale-95",
        ghost: "hover:bg-background hover:text-foreground transform hover:scale-105 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline transform hover:scale-105",
        glass: "bg-glass/80 backdrop-blur-md border border-glass-border text-foreground hover:bg-glass hover:shadow-glass-hover transform hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 py-4 text-base",
        xl: "h-14 rounded-2xl px-10 py-5 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
