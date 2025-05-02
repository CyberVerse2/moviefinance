import { Heart, Coins, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  StackedCard,
  StackedCardContent,
  StackedCardFooter,
} from "@/app/components/ui/stacked-card";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    image: string;
    genre: string;
    director: string;
    synopsis: string;
    fundingGoal?: number;
    fundingCurrent?: number;
    fundingPercentage?: number;
    daysLeft?: number;
    backers?: number;
    tokenSymbol?: string;
    tokenPrice?: number;
    stage?: string;
    trending?: boolean;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const {
    id,
    title,
    image,
    genre,
    director,
    synopsis,
    fundingPercentage = 0,
    daysLeft = 0,
    tokenSymbol = "",
    trending = false,
  } = project;

  return (
    <StackedCard className="overflow-hidden flex flex-col h-full transition-all">
      <div className="relative">
        <Link href={`/projects/${id}`}>
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
            {trending && (
              <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-xs shadow-stacked-sm">
                Trending
              </Badge>
            )}
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white shadow-stacked-sm"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Add to favorites</span>
        </Button>
      </div>

      <Link href={`/projects/${id}`} className="block flex-grow">
        <StackedCardContent className="p-3 pt-4 flex-grow space-y-3 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base line-clamp-1">{title}</h3>
              <Badge
                variant="outline"
                className="text-xs font-normal shadow-stacked-sm"
              >
                {genre}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{director}</p>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {synopsis}
          </p>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Funding Progress</span>
              <span className="font-medium">{fundingPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-stacked-inner">
              <div
                className="h-full bg-red-600 rounded-full"
                style={{ width: `${fundingPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-xs">
            <div className="flex items-center">
              <Coins className="h-3 w-3 mr-1 text-red-600" />
              <span>{tokenSymbol} Token</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
              <span>{daysLeft} days left</span>
            </div>
          </div>
        </StackedCardContent>
      </Link>

      <StackedCardFooter className="p-3 border-t bg-gray-50/50">
        <Link href={`/projects/${id}`} className="w-full">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-xs h-9 shadow-stacked-sm hover:shadow-stacked active:shadow-none active:translate-y-0.5 transition-all"
          >
            Invest Now
          </Button>
        </Link>
      </StackedCardFooter>
    </StackedCard>
  );
}
