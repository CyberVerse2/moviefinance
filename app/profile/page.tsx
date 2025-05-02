"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ProjectCard } from "@/app/components/project-card";
import { useAccount } from "wagmi";
import {
  Avatar,
  Name,
  Address,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";

export default function DashboardPage() {
  const { isConnected } = useAccount();

  const mockFundedProjects = [
    {
      id: "mock-proj-1",
      title: "The Last Journey (Funded)",
      image: "/placeholder.svg",
      genre: "Sci-Fi",
      director: "Jane Doe",
      synopsis: "A journey to the end of the universe.",
      fundingPercentage: 100,
      daysLeft: 0, 
      tokenSymbol: "LAST",
      trending: false,
    },
    {
      id: "mock-proj-3",
      title: "Beyond the Horizon (Funded)",
      image: "/placeholder.svg",
      genre: "Adventure",
      director: "Alex Ray",
      synopsis: "Exploring uncharted territories.",
      fundingPercentage: 100,
      daysLeft: 0,
      tokenSymbol: "BTH",
      trending: true,
    },
  ];

  const mockMarketPositions = [
    {
      id: "market-1",
      title: "Will 'The Last Journey' reach its funding goal?",
      outcome: "Yes",
      result: "Won", 
      stake: "100 LAST",
      payout: "150 LAST",
    },
    {
      id: "market-2",
      title: "Will 'Echoes of Tomorrow' be selected for Sundance?",
      outcome: "No",
      result: "Pending",
      stake: "50 ECHO",
      payout: "-",
    },
  ];

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          View your connected wallet details.
        </p>
      </div>

      {isConnected ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Wallet Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Identity className="pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
            </CardContent>
          </Card>

          <Tabs defaultValue="funded-projects" className="mt-8 w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="funded-projects">Funded Projects</TabsTrigger>
              <TabsTrigger value="market-positions">Market Positions</TabsTrigger>
            </TabsList>

            <TabsContent value="funded-projects" className="mt-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockFundedProjects.length > 0 ? (
                  mockFundedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full text-center py-4">
                    You haven&apos;t funded any projects yet.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="market-positions" className="mt-4">
              <div className="space-y-4">
                {mockMarketPositions.length > 0 ? (
                  mockMarketPositions.map((position) => (
                    <Card key={position.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{position.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Your Position: <span className="font-medium">{position.outcome}</span></p>
                        <p>Stake: <span className="font-medium">{position.stake}</span></p>
                        <p>Result: <span className="font-medium">{position.result}</span></p>
                        {position.result === "Won" && (
                          <p>Payout: <span className="font-medium text-green-600">{position.payout}</span></p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    You haven&apos;t participated in any prediction markets yet.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Wallet Not Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please connect your wallet using the button in the header to view
              your profile details.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
