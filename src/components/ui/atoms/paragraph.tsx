import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// import * as React from 'react';

// const buttonVariants = cva(
//   'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
//   {
//     variants: {
//       variant: {
//         default:
//           'bg-primary text-primary-foreground shadow hover:bg-primary/90',
//         destructive:
//           'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
//         outline:
//           'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
//         secondary:
//           'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
//         ghost: 'hover:bg-accent hover:text-accent-foreground',
//         link: 'text-primary underline-offset-4 hover:underline'
//       },
//       size: {
//         default: 'h-9 px-4 py-2',
//         sm: 'h-8 rounded-md px-3 text-xs',
//         lg: 'h-10 rounded-md px-8',
//         icon: 'h-9 w-9'
//       }
//     },
//     defaultVariants: {
//       variant: 'default',
//       size: 'default'
//     }
//   }
// );

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//   VariantProps<typeof buttonVariants> {
//   asChild?: boolean;
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant, size, asChild = false, ...props }, ref) => {
//     const Comp = asChild ? Slot : 'button';
//     return (
//       <Comp
//         className={cn(buttonVariants({ variant, size, className }))}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );
// Button.displayName = 'Button';

// export { Button, buttonVariants };

const paragraphVariants = cva(
  'mb-5 font-light text-gray-500 dark:text-gray-400',
  {
    variants: {
      variant: {
        default: 'mb-5 font-light text-gray-500 dark:text-gray-400',
        secondary: 'mb-5 font-light text-gray-500 dark:text-gray-400',
        destructive: 'mb-5 font-light text-gray-500 dark:text-gray-400',
        outline: 'mb-5 font-light text-gray-500 dark:text-gray-400'
      },
      size: {
        default: 'text-base lg:text-lg xl:text-xl',
        sm: 'text-sm lg:text-base xl:text-lg',
        lg: 'text-lg lg:text-xl xl:text-2xl',
        xl: 'text-xl lg:text-2xl xl:text-3xl',
        xs: 'text-xs lg:text-sm xl:text-base',
        md: 'text-md lg:text-lg xl:text-xl'
      }
    }
  }
);

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {
  asChild?: boolean;
}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'p';
    return (
      <Comp
        className={cn(paragraphVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Paragraph.displayName = 'Paragraph';

export { Paragraph, paragraphVariants };
