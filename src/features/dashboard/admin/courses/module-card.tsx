import {
  ChevronDown,
  FileVideo,
  MoreHorizontal,
  Pencil,
  PlayCircle,
  PlusIcon,
  Trash2,
} from "lucide-react"
import { type Lesson, type Module } from "@/data/mock-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ModuleCardProps = {
  index: number
  module: Module
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditModule: (module: Module) => void
  onDeleteModule: (module: Module) => void
  onAddVideo: (module: Module) => void
  onEditVideo: (module: Module, lesson: Lesson) => void
  onDeleteVideo: (module: Module, lesson: Lesson) => void
}

export function ModuleCard({
  index,
  module,
  open,
  onOpenChange,
  onEditModule,
  onDeleteModule,
  onAddVideo,
  onEditVideo,
  onDeleteVideo,
}: ModuleCardProps) {
  const videoCount = module.lessons.length

  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm",
        open && "border-primary/40"
      )}
    >
      {/* HEADER */}
      <div className="flex items-center gap-2 px-4 py-3">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex flex-1 items-center gap-3 text-left"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
              {index + 1}
            </span>

            <div className="flex-1 min-w-0">
              <h3 className="truncate text-sm font-semibold">
                {module.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {videoCount} {videoCount === 1 ? "video" : "videos"}
              </p>
            </div>

            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                open && "rotate-180"
              )}
            />
          </button>
        </CollapsibleTrigger>

        {/* ADD VIDEO */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAddVideo(module)}
        >
          <PlusIcon className="mr-1 size-3.5" />
          Add
        </Button>

        {/* ACTION MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditModule(module)}>
              <Pencil className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => onDeleteModule(module)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* CONTENT */}
      <CollapsibleContent>
        <div className="border-t bg-muted/20 px-4 py-3">
          {videoCount === 0 ? (
            <EmptyVideos onAdd={() => onAddVideo(module)} />
          ) : (
            <ul className="space-y-2">
              {module.lessons.map((lesson) => (
                <VideoItem
                  key={lesson.id}
                  lesson={lesson}
                  onEdit={() => onEditVideo(module, lesson)}
                  onDelete={() => onDeleteVideo(module, lesson)}
                />
              ))}
            </ul>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function EmptyVideos({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-background py-6 text-center">
      <FileVideo className="size-5 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">
        No videos yet
      </p>
      <Button size="sm" variant="secondary" onClick={onAdd}>
        <PlusIcon className="mr-1 size-3.5" />
        Add Video
      </Button>
    </div>
  )
}

/* ✅ CLEAN VIDEO ITEM (ONLY TITLE) */
function VideoItem({
  lesson,
  onEdit,
  onDelete,
}: {
  lesson: Lesson
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <li className="flex items-center justify-between rounded-md border bg-background px-3 py-2 hover:bg-muted/50 transition">
      
      {/* LEFT */}
      <div className="flex items-center gap-2 min-w-0">
        <PlayCircle className="size-4 text-muted-foreground" />
        <p className="truncate text-sm font-medium">
          {lesson.title}
        </p>
      </div>

      {/* RIGHT */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="size-7">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}