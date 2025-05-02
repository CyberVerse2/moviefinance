import { Coins, TrendingUp, BarChart3, PieChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"

interface ProjectTokenInfoProps {
  tokenSymbol: string
  tokenSupply: number
  tokenPrice: number
  revenueShare: number
}

export function ProjectTokenInfo({
  tokenSymbol,
  tokenSupply,
  tokenPrice,
  revenueShare,
}: ProjectTokenInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Token Economics</h2>
        <p className="mt-2 text-muted-foreground">
          The {tokenSymbol} token represents ownership in this film project. Token holders are entitled to a share of
          the film&apos;s revenue and exclusive benefits.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Token Symbol</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Coins className="mr-2 h-4 w-4 text-red-600" />
              <span className="text-2xl font-bold">{tokenSymbol}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Token Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-red-600" />
              <span className="text-2xl font-bold">${tokenPrice.toFixed(2)} USD</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4 text-red-600" />
              <span className="text-2xl font-bold">{tokenSupply.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <PieChart className="mr-2 h-4 w-4 text-red-600" />
              <span className="text-2xl font-bold">{revenueShare}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Token Utility</h3>
        <ul className="mt-2 space-y-2 text-muted-foreground">
          <li className="flex items-start">
            <span className="mr-2 text-red-600">•</span>
            <span>Share in {revenueShare}% of the film&apos;s revenue (box office, streaming, merchandise)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-red-600">•</span>
            <span>Access to exclusive behind-the-scenes content and updates</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-red-600">•</span>
            <span>Digital collectibles and NFTs related to the film</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-red-600">•</span>
            <span>Voting rights on certain creative decisions (for major token holders)</span>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Token Distribution</h3>
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between text-sm">
              <span>Investors (Public Sale)</span>
              <span>60%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-red-600" style={{ width: "60%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Team & Advisors</span>
              <span>20%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-red-600" style={{ width: "20%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Marketing & Partnerships</span>
              <span>10%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-red-600" style={{ width: "10%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Community Rewards</span>
              <span>5%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-red-600" style={{ width: "5%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Reserve</span>
              <span>5%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-red-600" style={{ width: "5%" }}></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Smart Contract</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The {tokenSymbol} token is implemented as an ERC-20 token on the Ethereum blockchain. The smart contract
          handles token issuance, distribution, and revenue sharing.
        </p>
        <div className="mt-2 rounded-md bg-muted p-2 font-mono text-xs">0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t</div>
      </div>
    </div>
  )
}
