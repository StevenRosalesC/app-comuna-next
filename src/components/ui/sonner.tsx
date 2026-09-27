"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CircleCheck, Info, AlertTriangle, AlertOctagon, Loader2 } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:p-4 font-sans bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 shadow-2xl",
          description: "group-[.toast]:text-muted-foreground text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error:
            "group-[.toaster]:!bg-rose-50 dark:group-[.toaster]:!bg-rose-950/80 group-[.toaster]:!text-rose-950 dark:group-[.toaster]:!text-rose-100 group-[.toaster]:!border-rose-300 dark:group-[.toaster]:!border-rose-800",
          success:
            "group-[.toaster]:!bg-emerald-50 dark:group-[.toaster]:!bg-emerald-950/80 group-[.toaster]:!text-emerald-950 dark:group-[.toaster]:!text-emerald-100 group-[.toaster]:!border-emerald-300 dark:group-[.toaster]:!border-emerald-800",
          warning:
            "group-[.toaster]:!bg-amber-50 dark:group-[.toaster]:!bg-amber-950/80 group-[.toaster]:!text-amber-950 dark:group-[.toaster]:!text-amber-100 group-[.toaster]:!border-amber-300 dark:group-[.toaster]:!border-amber-800",
          info:
            "group-[.toaster]:!bg-blue-50 dark:group-[.toaster]:!bg-blue-950/80 group-[.toaster]:!text-blue-950 dark:group-[.toaster]:!text-blue-100 group-[.toaster]:!border-blue-300 dark:group-[.toaster]:!border-blue-800"
        }
      }}
      icons={{
        success: <CircleCheck className="size-4 text-emerald-600 dark:text-emerald-400" />,
        info: <Info className="size-4 text-blue-600 dark:text-blue-400" />,
        warning: <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />,
        error: <AlertOctagon className="size-4 text-rose-600 dark:text-rose-400" />,
        loading: <Loader2 className="size-4 animate-spin text-primary" />
      }}
      {...props}
    />
  );
};

export { Toaster };
