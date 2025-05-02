import { Search, Filter, ChevronDown } from "lucide-react"
import { StackedInput } from "@/app/components/ui/stacked-input"
import { StackedButton } from "@/app/components/ui/stacked-button"
import { StackedCard, StackedCardContent } from "@/app/components/ui/stacked-card"

export function StackedFilter() {
  return (
    <StackedCard className="mb-6">
      <StackedCardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <StackedInput placeholder="Search projects..." className="pl-9" />
          </div>

          <div className="flex flex-wrap gap-2">
            <StackedButton variant="outline" size="sm" className="flex items-center">
              Genre
              <ChevronDown className="ml-1 h-4 w-4" />
            </StackedButton>
            <StackedButton variant="outline" size="sm" className="flex items-center">
              Funding Stage
              <ChevronDown className="ml-1 h-4 w-4" />
            </StackedButton>
            <StackedButton variant="outline" size="sm" className="flex items-center">
              Sort By
              <ChevronDown className="ml-1 h-4 w-4" />
            </StackedButton>
            <StackedButton variant="outline" size="sm" className="flex items-center">
              <Filter className="mr-1 h-4 w-4" />
              More Filters
            </StackedButton>
          </div>
        </div>
      </StackedCardContent>
    </StackedCard>
  )
}
