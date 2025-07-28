import * as React from "react"
import { cn } from "../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "default" | "ghost"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", size = "md", children, ...props }, ref) => {
    const baseStyles = "rounded-xl border transition duration-200 font-medium"
    
    const variants = {
      outline: "border-neutral-600 text-black bg-white hover:bg-gray-100",
      default: "border-transparent text-white bg-black hover:bg-gray-800",
      ghost: "border-transparent text-black bg-transparent hover:bg-gray-100"
    }
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    }
    
    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button } 