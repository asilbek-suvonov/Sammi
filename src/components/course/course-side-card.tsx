import { ContactDialog } from "@/components/contact-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Course } from "@/data/mock-data"
import { getCourseStats } from "@/lib/course-stats"
import { levelVariant } from "@/lib/variants"
import { Star } from "lucide-react"

interface CourseSideCardProps {
  course: Course
  totalLessons?: number
  enrolled?: boolean
  onWatch?: () => void
}

export function CourseSideCard({
  course,
  totalLessons,
  enrolled = false,
  onWatch,
}: CourseSideCardProps) {
  const stats = course ? getCourseStats(course) : null
  const lessonCount = totalLessons ?? stats?.lessonCount ?? 0

  return (
    <div className="lg:sticky lg:top-20 lg:self-start">
      <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">

        {/* PRICE */}
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Course Price
          </p>
          <p className="text-3xl font-semibold text-foreground">
            {course?.price ?? "$0"}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={() => onWatch?.()}
          >
            {enrolled ? "Continue Watching" : "Watch Course"}
          </Button>

          <ContactDialog
            subject={course.title}
            trigger={
              <Button
                variant="outline"
                className="w-full"
                size="lg"
              >
                Contact
              </Button>
            }
          />
        </div>

        {/* COURSE INFO */}
        <div className="space-y-4 border-t pt-4 text-sm">

          <InfoRow label="Modules" value={stats?.moduleCount ?? course?.modules?.length ?? 0} />
          <InfoRow label="Total lessons" value={lessonCount} />
          <InfoRow
            label="Duration"
            value={stats ? `${stats.hoursLabel} total` : `${course?.hours ?? 0}h total`}
          />
          <InfoRow
            label="Students"
            value={
              course?.students
                ? course.students.toLocaleString()
                : "0"
            }
          />

          {/* LEVEL */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Level</span>
            <Badge
              variant={levelVariant(course?.level ?? "beginner")}
              className="text-[11px] capitalize"
            >
              {course?.level ?? "beginner"}
            </Badge>
          </div>

          {/* RATING */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Rating</span>
            <span className="flex items-center gap-1 font-medium">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {course?.rating ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ✅ REUSABLE ROW COMPONENT */
function InfoRow({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}