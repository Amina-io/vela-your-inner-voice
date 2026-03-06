import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body transition-all focus-visible:outline-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 active-press",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground active:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground active:bg-destructive/90",
        outline: "border border-primary text-primary bg-transparent active:bg-primary/5",
        secondary: "bg-secondary text-secondary-foreground active:bg-secondary/80",
        ghost: "text-foreground/50 active:text-foreground/70",
        link: "text-primary underline-offset-4 active:underline",
        // VELA variants
        "vela-primary": "bg-primary text-primary-foreground font-medium text-base h-14 rounded-full w-full active:scale-[0.97] disabled:bg-muted disabled:text-muted-foreground",
        "vela-secondary": "border border-primary text-primary bg-transparent font-medium text-base h-[52px] rounded-full w-full active:scale-[0.97]",
        "vela-ghost": "text-foreground/50 font-light text-sm",
        "vela-gold": "bg-accent text-vela-dark font-medium text-base h-14 rounded-full w-full active:scale-[0.97]",
        "vela-dark": "bg-vela-charcoal text-primary-foreground font-medium text-[15px] h-[52px] rounded-full w-full active:scale-[0.97]",
        "vela-white": "bg-background border border-border text-foreground font-medium text-[15px] h-[52px] rounded-full w-full active:scale-[0.97]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        vela: "h-14 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
