import { MarketingHeader } from "@/components/marketing/marketing-header"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <MarketingHeader />
      {children}
    </div>
  )
}
