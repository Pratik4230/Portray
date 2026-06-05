import Link from "next/link"

import { BackgroundBeams } from "@/components/ui/background-beams"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function AuthLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="font-medium text-foreground underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  )
}

export function AuthShell({
  title,
  description,
  children,
  footer,
  className,
}: {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}) {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background p-6">
      <BackgroundBeams className="pointer-events-none absolute inset-0 opacity-40" />
      <Card
        className={cn(
          "relative z-10 w-full max-w-md border-border/80 bg-card/95 shadow-xl backdrop-blur-md",
          className,
        )}
      >
        <CardHeader className="space-y-3">
          <Link
            href="/"
            className="text-sm font-medium tracking-tight text-muted-foreground hover:text-foreground"
          >
            Portray
          </Link>
          <div className="space-y-1">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
        {footer ? (
          <p className="px-6 pb-6 text-center text-sm text-muted-foreground sm:text-left">
            {footer}
          </p>
        ) : null}
      </Card>
    </div>
  )
}
