import { unstable_noStore as noStore } from "next/cache"

import { countContactMessagesThisMonth } from "@/lib/db/repositories/contact-messages"

export async function PortfolioStats({ userId }: { userId: string }) {
  noStore()

  const count = await countContactMessagesThisMonth(userId)

  return (
    <p className="text-sm text-muted-foreground">
      {count === 0
        ? "No recruiter messages this month yet."
        : `${count} recruiter message${count === 1 ? "" : "s"} this month.`}
    </p>
  )
}
