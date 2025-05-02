import { Input } from "@/components/ui/input"
import PersonsActionsSection from "./personsActionsSection"

interface PersonsTableToolbarProps {
  search: string
  onSearchChange: (value: string) => void
}

export function PersonsTableToolbar({ search, onSearchChange }: PersonsTableToolbarProps) {
  return (
    <div className="flex flex-row items-center justify-between w-full gap-2 mb-4">
      <Input
        placeholder="Buscar persona"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="max-w-sm"
      />
      <PersonsActionsSection />
    </div>
  )
} 