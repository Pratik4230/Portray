import { Input } from "@/components/ui/input"

export function DevelopersSearch({ query }: { query?: string }) {
  return (
    <form action="/developers" method="get" className="max-w-md">
      <Input
        name="q"
        type="search"
        placeholder="Search by name, username, or skill..."
        defaultValue={query ?? ""}
      />
    </form>
  )
}
