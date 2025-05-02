import Link from "next/link"
import Image from "next/image"
import { MessageSquare, Users, Video, Calendar, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CommunityPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Community Hub</h1>
        <p className="text-muted-foreground">
          Connect with filmmakers and film enthusiasts, join discussions, and participate in events.
        </p>
      </div>

      <div className="my-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search community..." className="w-full pl-8" />
        </div>
        <Link href="/community/new-topic">
          <Button className="bg-red-600 hover:bg-red-700">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Topic
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="discussions" className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="screenings">Screenings</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="mt-4">
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={`/placeholder.svg?height=40&width=40&text=U${i}`}
                        alt="User avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <CardTitle className="text-base">
                          {i === 1
                            ? "Tips for first-time filmmakers seeking funding"
                            : i === 2
                              ? "How to structure your token economics for maximum appeal"
                              : i === 3
                                ? "Legal considerations for revenue-sharing tokens"
                                : i === 4
                                  ? "Marketing strategies for indie films"
                                  : "Best cameras for low-budget filmmaking"}
                        </CardTitle>
                        <CardDescription>
                          Posted by{" "}
                          {i === 1
                            ? "FilmDirector23"
                            : i === 2
                              ? "TokenExpert"
                              : i === 3
                                ? "LegalEagle"
                                : i === 4
                                  ? "MarketingGuru"
                                  : "GearHead"}{" "}
                          •{" "}
                          {i === 1
                            ? "2 hours"
                            : i === 2
                              ? "1 day"
                              : i === 3
                                ? "3 days"
                                : i === 4
                                  ? "1 week"
                                  : "2 weeks"}{" "}
                          ago
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{i * 7 + 3}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="border-t p-4 flex justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{i * 12} participants</span>
                  </div>
                  <Link href={`/community/topic/${i}`}>
                    <Button variant="ghost" size="sm">
                      View Discussion
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={`/placeholder.svg?height=200&width=400&text=Event%20${i}`}
                    alt={`Event ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>
                    {i === 1
                      ? "Blockchain for Filmmakers Workshop"
                      : i === 2
                        ? "Indie Film Financing Panel"
                        : "Script to Screen: The Journey"}
                  </CardTitle>
                  <CardDescription>
                    {i === 1
                      ? "Learn how blockchain technology can revolutionize film financing"
                      : i === 2
                        ? "Industry experts discuss innovative funding models"
                        : "Follow a film from concept to completion"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {i === 1
                        ? "May 15, 2023 • 2:00 PM EST"
                        : i === 2
                          ? "June 3, 2023 • 1:00 PM EST"
                          : "June 22, 2023 • 3:00 PM EST"}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button className="w-full bg-red-600 hover:bg-red-700">Register</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="screenings" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={`/placeholder.svg?height=200&width=400&text=Screening%20${i}`}
                    alt={`Screening ${i}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-12 w-12 text-white opacity-75" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>
                    {i === 1
                      ? "The Last Journey: Work-in-Progress"
                      : i === 2
                        ? "Echoes of Tomorrow: First Look"
                        : "Beyond the Horizon: Director's Cut"}
                  </CardTitle>
                  <CardDescription>
                    {i === 1
                      ? "Exclusive screening for backers only"
                      : i === 2
                        ? "Special preview with filmmaker Q&A"
                        : "Extended version with commentary"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {i === 1
                        ? "May 20, 2023 • 7:00 PM EST"
                        : i === 2
                          ? "June 10, 2023 • 8:00 PM EST"
                          : "June 25, 2023 • 7:30 PM EST"}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button className="w-full bg-red-600 hover:bg-red-700">{i === 1 ? "Backer Access" : "RSVP"}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>
                    {i === 1
                      ? "Documentary Filmmakers"
                      : i === 2
                        ? "Blockchain Enthusiasts"
                        : i === 3
                          ? "Indie Horror Creators"
                          : i === 4
                            ? "Film Investors Network"
                            : i === 5
                              ? "Screenwriters Circle"
                              : "Post-Production Pros"}
                  </CardTitle>
                  <CardDescription>
                    {i === 1
                      ? "For creators of non-fiction films"
                      : i === 2
                        ? "Discussing blockchain applications in film"
                        : i === 3
                          ? "Low-budget horror filmmaking"
                          : i === 4
                            ? "Connect with potential film investors"
                            : i === 5
                              ? "Share and critique scripts"
                              : "Editing, VFX, sound design discussions"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{i * 57 + 123} members</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button className="w-full" variant="outline">
                    Join Group
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
