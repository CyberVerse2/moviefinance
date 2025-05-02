import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { projects } from "@/data/projects"

export default function InvestPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id) || projects[0]

  return (
    <div className="container px-4 py-6 md:px-6 md:py-12">
      <Link
        href={`/projects/${params.id}`}
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Project
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl mb-2">Invest in {project.title}</h1>
          <p className="text-muted-foreground mb-6">
            Support this film project and receive {project.tokenSymbol} tokens with potential returns.
          </p>

          <div className="relative h-48 w-full overflow-hidden rounded-lg mb-6 md:h-64">
            <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium mb-2">Project Overview</h2>
              <p className="text-sm text-muted-foreground">{project.synopsis}</p>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Token Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Token Symbol</p>
                  <p className="font-medium">{project.tokenSymbol}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Token Price</p>
                  <p className="font-medium">${project.tokenPrice}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Funding Progress</p>
                  <p className="font-medium">{project.fundingPercentage}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Days Left</p>
                  <p className="font-medium">{project.daysLeft} days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
              <CardDescription>Choose how much you want to invest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount (USD)</Label>
                <Input id="amount" type="number" placeholder="Enter amount" min="10" />
                <p className="text-xs text-muted-foreground">Minimum investment: $10</p>
              </div>

              <div className="rounded-lg bg-muted p-3">
                <div className="flex justify-between text-sm mb-2">
                  <span>Token Price:</span>
                  <span>${project.tokenPrice}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tokens to Receive:</span>
                  <span>0 {project.tokenSymbol}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>$0.00</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet Address (Optional)</Label>
                <Input id="wallet" placeholder="Enter your wallet address" />
                <p className="text-xs text-muted-foreground">If you don&apos;t have a wallet, we&apos;ll create one for you</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full bg-red-600 hover:bg-red-700">Invest Now</Button>
              <p className="text-xs text-center text-muted-foreground">
                By investing, you agree to our Terms of Service and acknowledge the risks involved in film investments.
              </p>
            </CardFooter>
          </Card>

          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Investment Tiers</h3>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" className="justify-start h-auto py-2 px-3">
                <div className="text-left">
                  <div className="font-medium">Early Supporter - $50</div>
                  <div className="text-xs text-muted-foreground">
                    Receive 500 {project.tokenSymbol} tokens + digital thank you
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-2 px-3">
                <div className="text-left">
                  <div className="font-medium">Film Enthusiast - $250</div>
                  <div className="text-xs text-muted-foreground">
                    Receive 2,500 {project.tokenSymbol} tokens + digital poster + early access
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-2 px-3">
                <div className="text-left">
                  <div className="font-medium">Executive Producer - $1,000</div>
                  <div className="text-xs text-muted-foreground">
                    Receive 10,000 {project.tokenSymbol} tokens + name in credits + exclusive updates
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
