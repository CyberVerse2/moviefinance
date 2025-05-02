import Link from "next/link"
import Image from "next/image"
import { BookOpen, Camera, FileText, MapPin, Scissors, Users, Award, Search } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"

export default function ResourcesPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Filmmaker Resources</h1>
        <p className="text-muted-foreground">
          Access specialized tools and resources to help bring your film project to life.
        </p>
      </div>

      <div className="my-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search resources..." className="w-full pl-8" />
        </div>
      </div>

      {/* Resource Categories */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Link href="/resources/script-feedback">
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Script Feedback</CardTitle>
              <FileText className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Get feedback on your screenplay from industry professionals and peers.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/resources/casting-calls">
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Casting Calls</CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Find actors for your project or apply for roles in upcoming films.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/resources/locations">
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filming Locations</CardTitle>
              <MapPin className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Browse our database of filming locations available for your production.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/resources/post-production">
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Post-Production</CardTitle>
              <Scissors className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Connect with editors, sound designers, and VFX artists for your project.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Featured Resources */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">Featured Resources</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Script Analysis Service</CardTitle>
                <FileText className="h-5 w-5 text-red-600" />
              </div>
              <CardDescription>Professional feedback on your screenplay from industry readers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our script analysis service provides detailed feedback on your screenplay&apos;s structure, characters,
                dialogue, and marketability. Get insights from readers who work with major studios and production
                companies.
              </p>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <span className="font-medium text-foreground">$150</span>
                <span className="ml-1">per screenplay</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-red-600 hover:bg-red-700">Learn More</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Budgeting Software</CardTitle>
                <BookOpen className="h-5 w-5 text-red-600" />
              </div>
              <CardDescription>Industry-standard film budgeting and scheduling tools</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create professional film budgets and production schedules with our specialized software. Includes
                templates for different types of productions and budget ranges.
              </p>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <span className="font-medium text-foreground">$25</span>
                <span className="ml-1">monthly subscription</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-red-600 hover:bg-red-700">Learn More</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Festival Submission Guide</CardTitle>
                <Award className="h-5 w-5 text-red-600" />
              </div>
              <CardDescription>Comprehensive guide to film festival submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our guide covers everything you need to know about submitting your film to festivals, including
                deadlines, submission requirements, and strategies for maximizing your chances of acceptance.
              </p>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Free</span>
                <span className="ml-1">for platform members</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-red-600 hover:bg-red-700">Download Guide</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Equipment Rentals */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">Equipment Rentals</h2>
        <p className="mt-2 text-muted-foreground">
          Partner rental houses offering special rates for MovieFinance projects.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={`/placeholder.svg?height=200&width=400&text=Equipment%20${i}`}
                  alt={`Equipment rental ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>
                  {i === 1 ? "CineTech Rentals" : i === 2 ? "LightCraft Equipment" : "SoundStage Pro"}
                </CardTitle>
                <CardDescription>
                  {i === 1
                    ? "Camera packages and lenses"
                    : i === 2
                      ? "Lighting and grip equipment"
                      : "Audio recording gear"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {i === 1
                    ? "Professional cinema cameras, lenses, and accessories for productions of all sizes."
                    : i === 2
                      ? "Complete lighting packages from small interviews to feature productions."
                      : "Professional sound recording equipment, from lavaliers to boom mics and mixers."}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-red-600">
                  <Camera className="mr-1 h-4 w-4" />
                  <span>15% discount for MovieFinance projects</span>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button className="w-full" variant="outline">
                  View Inventory
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Educational Resources */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">Educational Resources</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Webinars & Workshops</CardTitle>
              <CardDescription>
                Learn from industry professionals through our online educational content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Blockchain for Filmmakers</h3>
                    <p className="text-sm text-muted-foreground">
                      Understanding token economics and smart contracts for film financing
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Directing on a Budget</h3>
                    <p className="text-sm text-muted-foreground">
                      Techniques for maximizing production value with limited resources
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Film Distribution Strategies</h3>
                    <p className="text-sm text-muted-foreground">
                      Navigating traditional and emerging distribution channels
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                View All Webinars
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Articles & Guides</CardTitle>
              <CardDescription>In-depth articles on filmmaking, financing, and distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Link href="/resources/articles/token-economics" className="font-medium hover:text-red-600">
                    Designing Effective Token Economics for Film Projects
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    How to structure your film&apos;s token offering to attract investors and build community
                  </p>
                </div>
                <div>
                  <Link href="/resources/articles/legal-considerations" className="font-medium hover:text-red-600">
                    Legal Considerations for Tokenized Film Projects
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Navigating securities laws and regulatory compliance for blockchain-based film financing
                  </p>
                </div>
                <div>
                  <Link href="/resources/articles/marketing-strategies" className="font-medium hover:text-red-600">
                    Marketing Your Film in the Digital Age
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Building an audience before, during, and after production
                  </p>
                </div>
                <div>
                  <Link href="/resources/articles/festival-strategy" className="font-medium hover:text-red-600">
                    Crafting an Effective Film Festival Strategy
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Selecting the right festivals and maximizing your film&apos;s exposure
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                View All Articles
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
