import { BarChart3, TrendingUp, Award, Filter, Search } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"

export default function PredictionMarketsPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Prediction Markets</h1>
        <p className="text-muted-foreground">
          Trade contracts on film project outcomes and gain insights into market sentiment.
        </p>
      </div>

      <div className="my-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search markets..." className="w-full pl-8" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Market Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              <SelectItem value="funding">Funding Success</SelectItem>
              <SelectItem value="box-office">Box Office</SelectItem>
              <SelectItem value="awards">Awards</SelectItem>
              <SelectItem value="festivals">Festival Selection</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trending" className="mt-8">
        <div className="overflow-x-auto whitespace-nowrap pb-2 -mb-2">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new">New Markets</TabsTrigger>
            <TabsTrigger value="closing">Closing Soon</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="trending" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {i === 1
                        ? "Will &quot;The Last Journey&quot; reach its funding goal?"
                        : i === 2
                          ? "Will &quot;Echoes of Tomorrow&quot; be selected for Sundance?"
                          : i === 3
                            ? "Will &quot;Beyond the Horizon&quot; gross over $1M?"
                            : i === 4
                              ? "Will &quot;Midnight Shadows&quot; win Best Horror at Screamfest?"
                              : i === 5
                                ? "Will &quot;The Inventor&apos;s Daughter&quot; complete production by Q3?"
                                : "Will &quot;Urban Rhythms&quot; secure streaming distribution?"}
                    </CardTitle>
                    {i === 1 || i === 3 ? (
                      <TrendingUp className="h-5 w-5 text-red-600" />
                    ) : i === 2 || i === 5 ? (
                      <Award className="h-5 w-5 text-red-600" />
                    ) : (
                      <BarChart3 className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <CardDescription>
                    {i === 1
                      ? "Funding Success"
                      : i === 2
                        ? "Festival Selection"
                        : i === 3
                          ? "Box Office"
                          : i === 4
                            ? "Awards"
                            : i === 5
                              ? "Production Timeline"
                              : "Distribution"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Current Probability:</span>
                    <span
                      className={`font-bold ${
                        i === 1
                          ? "text-green-600"
                          : i === 2
                            ? "text-amber-600"
                            : i === 3
                              ? "text-green-600"
                              : i === 4
                                ? "text-red-600"
                                : i === 5
                                  ? "text-amber-600"
                                  : "text-green-600"
                      }`}
                    >
                      {i === 1 ? "78%" : i === 2 ? "52%" : i === 3 ? "65%" : i === 4 ? "32%" : i === 5 ? "48%" : "71%"}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${
                        i === 1
                          ? "bg-green-600"
                          : i === 2
                            ? "bg-amber-600"
                            : i === 3
                              ? "bg-green-600"
                              : i === 4
                                ? "bg-red-600"
                                : i === 5
                                  ? "bg-amber-600"
                                  : "bg-green-600"
                      }`}
                      style={{
                        width:
                          i === 1
                            ? "78%"
                            : i === 2
                              ? "52%"
                              : i === 3
                                ? "65%"
                                : i === 4
                                  ? "32%"
                                  : i === 5
                                    ? "48%"
                                    : "71%",
                      }}
                    ></div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                    <span>Volume: {i * 1250 + 500} tokens</span>
                    <span>Closes in {i * 3 + 5} days</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <div className="flex w-full justify-between gap-2">
                    <Button variant="outline" className="w-1/2">
                      Yes
                    </Button>
                    <Button variant="outline" className="w-1/2">
                      No
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Similar structure to trending tab, with different market data */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Will &quot;The Director&apos;s Cut&quot; reach 120% of its funding goal?</CardTitle>
                  <TrendingUp className="h-5 w-5 text-red-600" />
                </div>
                <CardDescription>Funding Success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Current Probability:</span>
                  <span className="font-bold text-amber-600">50%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-amber-600" style={{ width: "50%" }}></div>
                </div>
                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                  <span>Volume: 250 tokens</span>
                  <span>Closes in 30 days</span>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="flex w-full justify-between gap-2">
                  <Button variant="outline" className="w-1/2">
                    Yes
                  </Button>
                  <Button variant="outline" className="w-1/2">
                    No
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Will &quot;Neon Dreams&quot; win a cinematography award?</CardTitle>
                  <Award className="h-5 w-5 text-red-600" />
                </div>
                <CardDescription>Awards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Current Probability:</span>
                  <span className="font-bold text-green-600">68%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-green-600" style={{ width: "68%" }}></div>
                </div>
                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                  <span>Volume: 420 tokens</span>
                  <span>Closes in 90 days</span>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="flex w-full justify-between gap-2">
                  <Button variant="outline" className="w-1/2">
                    Yes
                  </Button>
                  <Button variant="outline" className="w-1/2">
                    No
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Will &quot;Silent Echo&quot; be completed under budget?</CardTitle>
                  <BarChart3 className="h-5 w-5 text-red-600" />
                </div>
                <CardDescription>Production</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Current Probability:</span>
                  <span className="font-bold text-red-600">35%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-red-600" style={{ width: "35%" }}></div>
                </div>
                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                  <span>Volume: 180 tokens</span>
                  <span>Closes in 60 days</span>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="flex w-full justify-between gap-2">
                  <Button variant="outline" className="w-1/2">
                    Yes
                  </Button>
                  <Button variant="outline" className="w-1/2">
                    No
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="closing" className="mt-4">
          {/* Markets that are closing soon */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Will &quot;The Last Journey&quot; reach its funding goal?</CardTitle>
                  <TrendingUp className="h-5 w-5 text-red-600" />
                </div>
                <CardDescription>Funding Success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Current Probability:</span>
                  <span className="font-bold text-green-600">78%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-green-600" style={{ width: "78%" }}></div>
                </div>
                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                  <span>Volume: 1750 tokens</span>
                  <span className="text-red-600 font-medium">Closes in 2 days</span>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="flex w-full justify-between gap-2">
                  <Button variant="outline" className="w-1/2">
                    Yes
                  </Button>
                  <Button variant="outline" className="w-1/2">
                    No
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resolved" className="mt-4">
          {/* Markets that have been resolved */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Will &quot;Moonlight Sonata&quot; be selected for TIFF?</CardTitle>
                  <Award className="h-5 w-5 text-red-600" />
                </div>
                <CardDescription>Festival Selection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Final Outcome:</span>
                  <span className="font-bold text-green-600">Yes</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-green-600" style={{ width: "100%" }}></div>
                </div>
                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                  <span>Volume: 2350 tokens</span>
                  <span>Resolved on May 1, 2023</span>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button className="w-full" disabled>
                  Market Resolved
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Will &quot;Desert Wind&quot; complete principal photography by March?
                  </CardTitle>
                  <BarChart3 className="h-5 w-5 text-red-600" />
                </div>
                <CardDescription>Production Timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Final Outcome:</span>
                  <span className="font-bold text-red-600">No</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-red-600" style={{ width: "0%" }}></div>
                </div>
                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                  <span>Volume: 1820 tokens</span>
                  <span>Resolved on April 15, 2023</span>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button className="w-full" disabled>
                  Market Resolved
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* How It Works Section */}
      <div className="mt-12 rounded-lg border p-6">
        <h2 className="text-2xl font-bold">How Prediction Markets Work</h2>
        <p className="mt-2 text-muted-foreground">
          Prediction markets allow users to trade contracts based on the outcome of future events related to film
          projects.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-semibold">Trade Contracts</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Buy and sell contracts representing your prediction on whether an event will occur.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-semibold">Market Insights</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The market price reflects the collective wisdom on the probability of an event occurring.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-semibold">Earn Rewards</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Contracts pay out based on the actual outcome when the market resolves.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

        <div className="mt-6 grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What are prediction markets?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Prediction markets are trading platforms where users can buy and sell contracts based on the outcome of
                future events. The market price reflects the collective assessment of the probability that an event will
                occur.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How do I participate in prediction markets?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                To participate, you need to create an account on MovieFinance and purchase platform tokens. You can then
                use these tokens to buy contracts in various prediction markets related to film projects.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How are markets resolved?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Markets are resolved based on verifiable outcomes. For example, a market on whether a film reaches its
                funding goal is resolved when the funding campaign ends. Our team verifies the outcome and resolves the
                market accordingly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">What insights can prediction markets provide?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Prediction markets aggregate information from many participants, providing valuable insights into the
                likelihood of various outcomes. Filmmakers can use this information to gauge market sentiment about
                their projects, while investors can use it to inform their investment decisions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 rounded-lg bg-red-600 p-8 text-white">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold">Ready to Start Trading?</h2>
          <p className="mt-2 max-w-2xl">
            Join our prediction markets to gain insights into film projects and potentially earn rewards based on your
            predictions.
          </p>
          <div className="mt-6 flex gap-4">
            <Button className="bg-white text-red-600 hover:bg-white/90">Sign Up Now</Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
