"use client"

import { useState } from "react"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/app/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Label } from "@/app/components/ui/label"
import { Slider } from "@/app/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"

export function MobileFilterBar() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="md:hidden mb-6">
      {/* Search Bar - Expandable */}
      {searchOpen ? (
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search projects..." className="pl-8 pr-8" autoFocus />
          </div>
          <Button variant="ghost" size="sm" className="shrink-0" onClick={() => setSearchOpen(false)}>
            Cancel
          </Button>
        </div>
      ) : null}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full h-9 grid grid-cols-3 bg-muted/50">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="trending" className="text-xs">
              Trending
            </TabsTrigger>
            <TabsTrigger value="ending" className="text-xs">
              Ending Soon
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-2">
        {!searchOpen && (
          <Button variant="outline" size="sm" className="flex-1 h-9 text-xs" onClick={() => setSearchOpen(true)}>
            <Search className="mr-1 h-3 w-3" />
            Search
          </Button>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 h-9 text-xs">
              <Filter className="mr-1 h-3 w-3" />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
            <SheetHeader className="text-left">
              <SheetTitle>Filter Projects</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto py-4 h-[calc(100%-8rem)]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Genre</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Drama", "Comedy", "Horror", "Sci-Fi", "Documentary", "Action"].map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox id={`mobile-genre-${genre}`} />
                        <Label htmlFor={`mobile-genre-${genre}`} className="text-sm">
                          {genre}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Funding Stage</h3>
                  <RadioGroup defaultValue="all">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="stage-all" />
                      <Label htmlFor="stage-all">All Stages</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pre" id="stage-pre" />
                      <Label htmlFor="stage-pre">Pre-production</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="production" id="stage-production" />
                      <Label htmlFor="stage-production">Production</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="post" id="stage-post" />
                      <Label htmlFor="stage-post">Post-production</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Funding Goal</h3>
                    <span className="text-xs text-muted-foreground">$10k - $500k</span>
                  </div>
                  <Slider defaultValue={[10, 500]} min={0} max={1000} step={10} />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Funding Progress</h3>
                  <RadioGroup defaultValue="all">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="progress-all" />
                      <Label htmlFor="progress-all">Any Progress</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0-25" id="progress-0-25" />
                      <Label htmlFor="progress-0-25">0-25%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="25-50" id="progress-25-50" />
                      <Label htmlFor="progress-25-50">25-50%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="50-75" id="progress-50-75" />
                      <Label htmlFor="progress-50-75">50-75%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="75-100" id="progress-75-100" />
                      <Label htmlFor="progress-75-100">75-100%</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Token Benefits</h3>
                  <div className="space-y-2">
                    {["Revenue Share", "Exclusive Content", "Voting Rights", "Festival Access"].map((benefit) => (
                      <div key={benefit} className="flex items-center space-x-2">
                        <Checkbox id={`mobile-benefit-${benefit}`} />
                        <Label htmlFor={`mobile-benefit-${benefit}`} className="text-sm">
                          {benefit}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <SheetFooter className="flex-row justify-between border-t pt-4">
              <Button variant="outline" size="sm">
                Reset All
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" size="sm">
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 h-9 text-xs">
              <ArrowUpDown className="mr-1 h-3 w-3" />
              Sort
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto rounded-t-xl">
            <SheetHeader className="text-left">
              <SheetTitle>Sort Projects</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <RadioGroup defaultValue="newest">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="newest" id="sort-newest" />
                  <Label htmlFor="sort-newest">Newest First</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ending-soon" id="sort-ending" />
                  <Label htmlFor="sort-ending">Ending Soon</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="most-funded" id="sort-most-funded" />
                  <Label htmlFor="sort-most-funded">Most Funded</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="least-funded" id="sort-least-funded" />
                  <Label htmlFor="sort-least-funded">Least Funded</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="highest-goal" id="sort-highest-goal" />
                  <Label htmlFor="sort-highest-goal">Highest Goal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lowest-goal" id="sort-lowest-goal" />
                  <Label htmlFor="sort-lowest-goal">Lowest Goal</Label>
                </div>
              </RadioGroup>
            </div>
            <SheetFooter className="flex-row justify-end border-t pt-4">
              <Button className="bg-red-600 hover:bg-red-700" size="sm">
                Apply
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
