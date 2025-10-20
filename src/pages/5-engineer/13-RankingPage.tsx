import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../1-HomePage/others/components/ui/avatar";
import { Input } from "../1-HomePage/others/components/ui/input";
import { Button } from "../1-HomePage/others/components/ui/button";
import { Badge } from "../1-HomePage/others/components/ui/badge";
import { Search, MapPin, BarChart3, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Users, User, UserCheck, Trophy, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../1-HomePage/others/components/ui/select";
import { Engineer, allEngineers } from "../1-HomePage/others/data/engineers";
import { EngineerProfile } from "../1-HomePage/others/components/ranking/EngineerProfile";
import { PerformanceChartPopover } from "../1-HomePage/others/components/ranking/PerformanceChartPopover";
import { AnnualPrizesHero } from "./others/features/ranking/components/AnnualPrizesHero";
import { YourRankCard } from "./others/features/ranking/components/YourRankCard";
import { LeaderboardPodium } from "./others/features/ranking/components/LeaderboardPodium";
import { HallOfFameSection } from "./others/features/ranking/components/HallOfFameSection";
import { HowRankingWorksModal } from "./others/features/ranking/components/HowRankingWorksModal";
import { RankTrendChart } from "./others/features/ranking/components/RankTrendChart";

interface EngineersTableProps {
  engineers: Engineer[];
  onEngineerClick: (engineerId: string) => void;
}

// Trophy component for top 3 ranks
const TrophyRank = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full text-white font-bold text-sm">
        🏆
      </div>
    );
  } else if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full text-white font-bold text-sm">
        🥈
      </div>
    );
  } else if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full text-white font-bold text-sm">
        🥉
      </div>
    );
  }
  return (
    <span className="text-sm font-medium text-gray-900">
      {rank}
    </span>
  );
};

// Performance indicator component
const PerformanceIndicator = ({ change }: { change: number }) => {
  if (change > 0) {
    return (
      <div className="flex items-center gap-1 text-green-600">
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm font-medium">+{change}</span>
      </div>
    );
  } else if (change < 0) {
    return (
      <div className="flex items-center gap-1 text-red-600">
        <TrendingDown className="w-4 h-4" />
        <span className="text-sm font-medium">{change}</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <Minus className="w-4 h-4" />
        <span className="text-sm font-medium">0</span>
      </div>
    );
  }
};

export function EngineersTable({ engineers, onEngineerClick, currentUserId }: EngineersTableProps & { currentUserId?: string }) {
  const [activeTab, setActiveTab] = useState<"all" | "our">("all");
  const [genderFilter, setGenderFilter] = useState<"all" | "man" | "woman">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique locations
  const locations = Array.from(new Set(engineers.map(e => e.location.split(',')[0].trim())));

  // Filter engineers
  const filteredEngineers = engineers.filter(engineer => {
    const matchesSearch = engineer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "all" || engineer.location.includes(locationFilter);
    const matchesGender = genderFilter === "all" || engineer.gender === genderFilter;
    return matchesSearch && matchesLocation && matchesGender;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEngineers = filteredEngineers.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Engineering Rankings
          </h1>
          <p className="text-xs text-muted-foreground">{filteredEngineers.length} engineers competing for excellence</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2 py-1">
            Top 100
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Gender Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={genderFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setGenderFilter("all")}
            className="gap-2 text-xs h-9"
          >
            <Users className="w-3.5 h-3.5" />
            All
          </Button>
          <Button
            variant={genderFilter === "man" ? "default" : "outline"}
            size="sm"
            onClick={() => setGenderFilter("man")}
            className="gap-2 text-xs h-9"
          >
            <User className="w-3.5 h-3.5" />
            Men
          </Button>
          <Button
            variant={genderFilter === "woman" ? "default" : "outline"}
            size="sm"
            onClick={() => setGenderFilter("woman")}
            className="gap-2 text-xs h-9"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Women
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search engineers by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-xs h-9"
          />
        </div>
        
        {/* Location Filter */}
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full lg:w-56 text-xs h-9">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <SelectValue placeholder="All Locations" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map(location => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
        <table className="w-full">
          <thead className="bg-primary border-b-2 border-primary">
            <tr>
              <th className="text-center px-4 py-3 text-xs font-semibold text-white">Rank</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-white">Engineer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-white">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-white">Expertise</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-white">Location</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-white">Score</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-white">Rating</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-white">Projects</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 bg-background">
            {paginatedEngineers.map((engineer, index) => {
              const rank = startIndex + index + 1;
              const isCurrentUser = currentUserId === engineer.id;
              const score = Math.round(engineer.rating * 200) - 15 + rank * 2; // Mock score calculation
              
              return (
                <tr
                  key={engineer.id}
                  onClick={() => onEngineerClick(engineer.id)}
                  className={`group cursor-pointer transition-all duration-300 ${
                    isCurrentUser 
                      ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-l-4 border-primary shadow-md scale-[1.02]' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <td className="px-4 py-4 text-center">
                    <TrophyRank rank={rank} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 ring-2 ring-border/20 group-hover:ring-primary/30 transition-all">
                        <AvatarImage src={engineer.profileImage} alt={engineer.name} />
                        <AvatarFallback className="text-xs font-semibold">
                          {engineer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{engineer.name}</p>
                        <p className="text-[10px] text-muted-foreground">{engineer.experience}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-primary font-medium">
                        ENG{engineer.id.padStart(3, '0')}
                      </span>
                      <PerformanceChartPopover engineer={engineer}>
                        <div className="cursor-pointer">
                          <PerformanceIndicator change={engineer.rankingChange} />
                        </div>
                      </PerformanceChartPopover>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-medium">{engineer.expertise}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs">{engineer.location.split(',')[0]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
                      <span className="text-sm font-bold text-primary">{score}</span>
                      <span className="text-[9px] text-muted-foreground">/1000</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold">{engineer.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-semibold">{engineer.projects}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-3 border-t border-border/30 flex items-center justify-between bg-muted/20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="gap-2 text-xs h-8"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 p-0 text-xs"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="gap-2 text-xs h-8"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function RankingPage() {
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Listen for modal trigger from child components
  useEffect(() => {
    const handleOpenModal = () => setShowHowItWorks(true);
    window.addEventListener('openRankingModal', handleOpenModal);
    return () => window.removeEventListener('openRankingModal', handleOpenModal);
  }, []);

  // Mock current user data (in real app, get from auth store)
  // For testing, we'll use a mid-rank engineer
  const currentUserId = "47"; // Mock user at rank #47
  const currentRank = 47;
  const previousRank = 52; // Improved from #52 last month
  const allTimeBestRank = 38; // Best was #38 in June 2024
  const currentScore = 892; // Out of 1000

  const handleEngineerClick = (engineerId: string) => {
    const engineer = allEngineers.find(e => e.id === engineerId);
    if (engineer) {
      setSelectedEngineer(engineer);
    }
  };

  const handleBack = () => {
    setSelectedEngineer(null);
  };

  if (selectedEngineer) {
    return <EngineerProfile engineer={selectedEngineer} onBack={handleBack} />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <div className="container mx-auto p-4 space-y-8">
          {/* Enhanced Table */}
          <EngineersTable 
            engineers={allEngineers} 
            onEngineerClick={handleEngineerClick}
            currentUserId={currentUserId}
          />

          {/* Your Rank Card */}
          <YourRankCard
            currentRank={currentRank}
            previousRank={previousRank}
            allTimeBestRank={allTimeBestRank}
            totalEngineers={allEngineers.length}
            currentScore={currentScore}
            nextTier={{
              name: "Platinum Tier",
              rankCutoff: 25,
              prize: "💎 SAR 10,000 + Course Bundle + Platinum Badge"
            }}
          />

          {/* Rank Trend Chart */}
          <RankTrendChart />

          {/* Annual Prizes Hero */}
          <AnnualPrizesHero />

          {/* Top 3 Podium */}
          <LeaderboardPodium
            topThree={allEngineers.slice(0, 3)}
            onEngineerClick={handleEngineerClick}
          />

          {/* Hall of Fame */}
          <HallOfFameSection />
        </div>
      </div>

      {/* How Ranking Works Modal */}
      <HowRankingWorksModal 
        isOpen={showHowItWorks} 
        onClose={() => setShowHowItWorks(false)} 
      />
    </>
  );
}
