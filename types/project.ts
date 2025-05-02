export interface Project {
  id: string
  title: string
  image: string
  genre: string
  director: string
  synopsis: string
  fundingGoal: number
  fundingCurrent: number
  fundingPercentage: number
  daysLeft: number
  backers: number
  tokenSymbol: string
  tokenPrice: number
  stage: string
  trending: boolean
  createdAt: string
}
