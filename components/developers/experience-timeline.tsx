import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ExperienceDTO } from "@/types/experience"

function formatDateRange(startDate: string, endDate: string | null) {
  if (endDate) {
    return `${startDate} – ${endDate}`
  }
  return `${startDate} – Present`
}

export function ExperienceTimeline({
  experience,
}: {
  experience: ExperienceDTO[]
}) {
  if (experience.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium tracking-tight">Experience</h2>
      <div className="space-y-4">
        {experience.map((entry) => (
          <Card key={entry.id} size="sm">
            <CardHeader>
              <CardTitle>{entry.role}</CardTitle>
              <CardDescription>
                {entry.company} · {formatDateRange(entry.startDate, entry.endDate)}
              </CardDescription>
            </CardHeader>
            {entry.description ? (
              <CardContent>
                <p className="text-muted-foreground">{entry.description}</p>
              </CardContent>
            ) : null}
          </Card>
        ))}
      </div>
    </section>
  )
}
