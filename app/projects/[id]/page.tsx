"use client";

import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react";

import { Button } from "@/app/components/ui/button"
import { Progress } from "@/app/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { ProjectTokenInfo } from "@/app/components/project-token-info"
import { Drawer, DrawerTrigger } from "@/app/components/ui/drawer";
import { InvestmentDrawer } from "@/app/components/investment-drawer";
import { ArrowLeft, Clock, Coins, Film, Share2, Star, Users } from 'lucide-react'

export default function ProjectPage({ params }: { params: { id: string } }) {
  // Mock project data - in a real app, this would be fetched from a database
  const project = {
    id: Number.parseInt(params.id),
    title:
      params.id === "1"
        ? "The Last Journey"
        : params.id === "2"
          ? "Echoes of Tomorrow"
          : params.id === "3"
            ? "Beyond the Horizon"
            : "Project " + params.id,
    category:
      params.id === "1" ? "Drama" : params.id === "2" ? "Sci-Fi" : params.id === "3" ? "Documentary" : "Category",
    director:
      params.id === "1"
        ? "Sarah Johnson"
        : params.id === "2"
          ? "Michael Chen"
          : params.id === "3"
            ? "Elena Rodriguez"
            : "Director",
    fundingGoal: params.id === "1" ? 150000 : params.id === "2" ? 280000 : params.id === "3" ? 95000 : 200000,
    fundingCurrent: params.id === "1" ? 112500 : params.id === "2" ? 117600 : params.id === "3" ? 84550 : 100000,
    fundingPercentage: params.id === "1" ? 75 : params.id === "2" ? 42 : params.id === "3" ? 89 : 50,
    backers: params.id === "1" ? 328 : params.id === "2" ? 512 : params.id === "3" ? 246 : 300,
    daysLeft: params.id === "1" ? 18 : params.id === "2" ? 32 : params.id === "3" ? 7 : 20,
    image: `/placeholder.svg?height=400&width=800&text=Project%20${params.id}`,
    description:
      params.id === "1"
        ? "A heartfelt drama about a father and daughter reconnecting on a cross-country road trip. After years of estrangement, they must confront their past and find a way forward together."
        : params.id === "2"
          ? "In a world where memories can be transferred, one woman discovers the dark truth behind the technology. As she unravels the conspiracy, she must fight to protect her own identity and memories."
          : params.id === "3"
            ? "An exploration of coastal communities adapting to climate change around the world. This documentary follows the stories of resilience and innovation in the face of rising sea levels."
            : "Project description goes here.",
    tokenSymbol:
      params.id === "1" ? "LAST" : params.id === "2" ? "ECHO" : params.id === "3" ? "HRZN" : "TKN" + params.id,
    tokenSupply: params.id === "1" ? 1000000 : params.id === "2" ? 2800000 : params.id === "3" ? 950000 : 1000000,
    tokenPrice: params.id === "1" ? 0.15 : params.id === "2" ? 0.1 : params.id === "3" ? 0.1 : 0.2,
    revenueShare: params.id === "1" ? 30 : params.id === "2" ? 25 : params.id === "3" ? 35 : 20,
    team: [
      { name: "Alice Brown", role: "Producer", image: "/placeholder-user.jpg" },
      { name: "Bob Green", role: "Cinematographer", image: "/placeholder-user.jpg" },
      { name: "Charlie Davis", role: "Lead Actor", image: "/placeholder-user.jpg" },
    ],
    updates: [
      { date: "2024-04-20", title: "Casting Complete!", content: "Excited to announce our main cast..." },
      { date: "2024-04-10", title: "Location Scouting Done", content: "Found the perfect locations for key scenes." },
    ],
  }

  const {
    title,
    category,
    director,
    fundingGoal,
    fundingCurrent,
    fundingPercentage,
    backers,
    daysLeft,
    image,
    description,
    team,
    updates,
  } = project

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Projects
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (Image & Core Info) */}
        <div className="md:col-span-2">
          <div className="relative w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="bg-muted"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <div className="flex items-center text-muted-foreground text-sm mb-4 space-x-4">
            <span className="flex items-center">
              <Film className="w-4 h-4 mr-1" /> {category}
            </span>
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1" /> Directed by {director}
            </span>
          </div>

          {/* Tabs for Details */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="token">Token Info</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 prose dark:prose-invert max-w-none">
              <p>{description}</p>
            </TabsContent>
            <TabsContent value="updates" className="mt-4 space-y-4">
              {updates.map((update, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{update.date}</p>
                  <h4 className="font-semibold mb-1">{update.title}</h4>
                  <p className="text-sm">{update.content}</p>
                </div>
              ))}
              {updates.length === 0 && <p>No updates posted yet.</p>}
            </TabsContent>
            <TabsContent value="team" className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden bg-muted">
                    <Image src={member.image} alt={member.name} layout="fill" objectFit="cover" />
                  </div>
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="token" className="mt-4">
              <ProjectTokenInfo
                tokenSymbol={project.tokenSymbol}
                tokenSupply={project.tokenSupply}
                tokenPrice={project.tokenPrice}
                revenueShare={project.revenueShare}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column (Funding & Actions) */}
        <div className="md:col-span-1 space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Funding Progress</h2>
            <Progress value={fundingPercentage} className="w-full mb-2" />
            <div className="text-lg font-bold mb-1">
              ${fundingCurrent.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">raised of ${fundingGoal.toLocaleString()} goal</span>
            </div>
            <div className="text-sm text-muted-foreground mb-4">{fundingPercentage}% funded</div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                <div>
                  <span className="font-semibold">{backers}</span>
                  <span className="block text-xs text-muted-foreground">Backers</span>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                <div>
                  <span className="font-semibold">{daysLeft}</span>
                  <span className="block text-xs text-muted-foreground">Days Left</span>
                </div>
              </div>
            </div>

            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button 
                  variant="default"
                  className="w-full bg-green-600 hover:bg-green-700 flex-grow sm:flex-grow-0"
                  onClick={() => setIsDrawerOpen(true)} 
                >
                  <Coins className="w-5 h-5 mr-2" />
                  Invest Now
                </Button>
              </DrawerTrigger>
              <InvestmentDrawer tokenSymbol={project.tokenSymbol} onOpenChange={setIsDrawerOpen} />
            </Drawer>

            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" /> Share Project
            </Button>
          </div>

          {/* Placeholder for related projects or creator info */}
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">About the Director</h3>
            <p className="text-sm text-muted-foreground">More information about {director} coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
