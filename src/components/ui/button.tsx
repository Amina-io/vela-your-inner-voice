import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-normal tracking-[0.04em] focus-visible:outline-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-primary text-primary bg-transparent",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "text-foreground/50",
        link: "text-primary underline-offset-4",
        "vela-primary": "text-primary-foreground font-normal tracking-[0.04em] text-base h-14 rounded-full w-full disabled:bg-muted disabled:text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
        "vela-secondary": "border border-primary text-primary bg-transparent font-normal tracking-[0.04em] text-base h-[52px] rounded-full w-full",
        "vela-ghost": "text-foreground/50 font-light text-sm",
        "vela-gold": "text-vela-dark font-normal tracking-[0.04em] text-base h-14 rounded-full w-full shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
        "vela-cream": "font-normal tracking-[0.04em] text-base h-14 rounded-full w-full shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
        "vela-dark": "bg-vela-charcoal text-primary-foreground font-normal tracking-[0.04em] text-[15px] h-[52px] rounded-full w-full shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
        "vela-white": "bg-background border border-border text-foreground font-normal tracking-[0.04em] text-[15px] h-[52px] rounded-full w-full",
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
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const gradientStyle = (variant === "vela-primary" || variant === "default")
      ? { background: 'linear-gradient(135deg, hsl(22 65% 47%) 0%, hsl(20 68% 42%) 100%)', ...style }
      : variant === "vela-gold"
      ? { background: 'linear-gradient(135deg, hsl(37 40% 66%) 0%, hsl(34 45% 60%) 100%)', ...style }
      : variant === "vela-cream"
      ? { background: '#FAF8F4', color: '#1C1C1E', ...style }
      : style;
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{
          transition: 'transform 150ms ease-out, box-shadow 150ms ease-out, opacity 150ms ease-out',
          ...gradientStyle,
        }}
        onPointerDown={(e) => {
          const target = e.currentTarget as HTMLElement;
          target.style.transform = 'scale(0.97)';
          target.style.opacity = '0.9';
        }}
        onPointerUp={(e) => {
          const target = e.currentTarget as HTMLElement;
          target.style.transform = 'scale(1)';
          target.style.opacity = '1';
        }}
        onPointerLeave={(e) => {
          const target = e.currentTarget as HTMLElement;
          target.style.transform = 'scale(1)';
          target.style.opacity = '1';
        }}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
