import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import Icon from "../Icon"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:select-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary active:bg-primary-active text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive active:bg-destructive-active text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm active:bg-accent-active hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary active:bg-secondary-active text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent active:bg-accent-active hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {
          loading
            ? <>
                <div className="relative">
                  <div className="invisible">
                    {children}
                  </div>
                  <div className="absolute flex left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Icon name="progress_activity" className="animate-spin" />
                  </div>
                </div>
              </>
            : children
        }
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
