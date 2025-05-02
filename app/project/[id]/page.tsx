"use client"

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label"; 
import { Input } from "@/app/components/ui/input"; 
import Link from 'next/link';
import { ArrowLeft, DollarSign, Users, Target } from 'lucide-react';
import Image from 'next/image'; // Use next/image for optimized images

// Placeholder type for Project data - replace with actual type later
interface ProjectData {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  fundingGoalUsd: number;
  currentFundingUsd: number; // Example: add current funding
  creatorWalletAddress: string;
  zoraContractAddress?: string;
  metadataUri?: string;
}

export default function ProjectDisplayPage() {
  const params = useParams();
  const id = params?.id as string; // Get project ID from URL
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call to fetch project data by ID
        // For now, using mock data based on ID
        console.log(`Fetching project data for ID: ${id}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

        // --- Mock Data --- 
        const mockProject: ProjectData = {
            id: id,
            title: `Mock Film Project ${id}`,
            description: "This is a captivating mock description for a film project that aims to explore deep themes and entertain audiences worldwide. Funding needed for production.",
            imageUrl: "/placeholder-poster.png", // Ensure you have a placeholder image in /public
            fundingGoalUsd: 50000 + parseInt(id) * 1000, // Example dynamic goal
            currentFundingUsd: 15000 + parseInt(id) * 500, // Example dynamic funding
            creatorWalletAddress: `0xCreatorWalletAddress...${id}`,
            zoraContractAddress: `0xZoraContract...${id}`,
            metadataUri: `ipfs://mockMetadataCID...${id}`
        };
        // --- End Mock Data ---

        // Simulate API failure for a specific ID for testing
        if (id === 'error') {
          throw new Error('Failed to fetch project data (Simulated)');
        }
        
        setProject(mockProject);

      } catch (err: any) { // Use any for now, refine later
        console.error("Error fetching project:", err);
        setError(err.message || 'Failed to load project data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const fundingPercentage = project ? (project.currentFundingUsd / project.fundingGoalUsd) * 100 : 0;

  if (isLoading) {
    return (
        <div className="container mx-auto max-w-4xl py-12 flex justify-center items-center min-h-[60vh]">
            <p>Loading project details...</p>
            {/* TODO: Add a spinner component */}
        </div>
    );
  }

  if (error) {
    return (
        <div className="container mx-auto max-w-4xl py-12 text-center">
            <p className="text-red-600">Error: {error}</p>
            <Link href="/" passHref>
                <Button variant="outline" className="mt-4">Back to Home</Button>
            </Link>
        </div>
    );
  }

  if (!project) {
    return (
        <div className="container mx-auto max-w-4xl py-12 text-center">
            <p>Project not found.</p>
             <Link href="/" passHref>
                <Button variant="outline" className="mt-4">Back to Home</Button>
            </Link>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
        <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
        </Link>

        <Card>
            <CardHeader>
                <CardTitle className="text-3xl mb-2">{project.title}</CardTitle>
                <CardDescription>Created by: <span className="font-mono text-xs">{project.creatorWalletAddress}</span></CardDescription>
                 {project.imageUrl && (
                    <div className="mt-4 relative w-full h-64 md:h-96 overflow-hidden rounded-lg">
                        <Image
                            src={project.imageUrl}
                            alt={`${project.title} Poster`}
                            layout="fill"
                            objectFit="cover"
                            priority // Prioritize loading the main image
                        />
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-muted-foreground">{project.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card className="p-4">
                        <CardHeader className="p-2">
                           <DollarSign className="mx-auto h-8 w-8 text-primary mb-2"/>
                            <CardTitle>${project.currentFundingUsd.toLocaleString()}</CardTitle>
                            <CardDescription>Raised</CardDescription>
                        </CardHeader>
                    </Card>
                     <Card className="p-4">
                        <CardHeader className="p-2">
                             <Target className="mx-auto h-8 w-8 text-primary mb-2"/>
                            <CardTitle>${project.fundingGoalUsd.toLocaleString()}</CardTitle>
                            <CardDescription>Goal</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="p-4">
                         <CardHeader className="p-2">
                             <Users className="mx-auto h-8 w-8 text-primary mb-2"/>
                             {/* Placeholder for Backer Count */}
                            <CardTitle>--</CardTitle>
                            <CardDescription>Backers</CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                <div>
                    <Label className="mb-2 block">Funding Progress</Label>
                    <Progress value={fundingPercentage} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-1 text-right">{fundingPercentage.toFixed(1)}% funded</p>
                </div>

                {/* Placeholder for Zora Details */}
                {project.zoraContractAddress && (
                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold mb-2">On-Chain Details (Zora)</h3>
                        <p className="text-sm">Contract Address: <span className="font-mono text-xs">{project.zoraContractAddress}</span></p>
                         {/* TODO: Add link to block explorer (BaseScan) */}
                         {/* TODO: Display token details (supply, price?) fetched from contract */}
                    </div>
                )}

                 {/* Placeholder for Investment Section */}
                 <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold mb-2">Invest in this Project</h3>
                    <p className="text-sm text-muted-foreground mb-4">Support this film and potentially earn rewards.</p>
                    {/* TODO: Add Investment Input + Button */} 
                    <div className="flex items-center space-x-2">
                        <Input type="number" placeholder="Amount (ETH/USDC)" className="max-w-xs" />
                         <Button disabled>Invest Now (Coming Soon)</Button>
                    </div>
                </div>

            </CardContent>
            <CardFooter>
                 {/* Optional: Add sharing buttons or other actions */}
            </CardFooter>
        </Card>
    </div>
  );
}
