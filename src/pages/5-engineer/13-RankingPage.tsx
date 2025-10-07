import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../1-HomePage/others/components/ui/avatar";
import { Input } from "../1-HomePage/others/components/ui/input";
import { Button } from "../1-HomePage/others/components/ui/button";
import { Search, MapPin, Home, BarChart3, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Users, User, UserCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../1-HomePage/others/components/ui/select";
import { Engineer, allEngineers } from "../1-HomePage/others/data/engineers";
import { EngineerProfile } from "../1-HomePage/others/components/ranking/EngineerProfile";
import { PerformanceChartPopover } from "../1-HomePage/others/components/ranking/PerformanceChartPopover";

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

export function EngineersTable({ engineers, onEngineerClick }: EngineersTableProps) {
  const [activeTab, setActiveTab] = useState<"all" | "our">("all");
  const [genderFilter, setGenderFilter] = useState<"all" | "man" | "woman">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique locations
  const locations = Array.from(new Set(engineers.map(e => e.location.split(',')[0].trim())));

  // Filter engineers
  let filteredEngineers = engineers.filter(engineer => {
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
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Engineering Rankings</h1>
          <p className="text-sm text-gray-600">{filteredEngineers.length} engineers</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
              activeTab === "all"
                ? "text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Ranking
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("our")}
            className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
              activeTab === "our"
                ? "text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Our ranking
            {activeTab === "our" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Filters Inside Table */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <Button
                    variant={genderFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGenderFilter("all")}
                    className="gap-2"
                  >
                    <Users className="w-4 h-4" />
                    All
                  </Button>
                  <Button
                    variant={genderFilter === "man" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGenderFilter("man")}
                    className="gap-2"
                  >
                    <User className="w-4 h-4" />
                    Man
                  </Button>
                  <Button
                    variant={genderFilter === "woman" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGenderFilter("woman")}
                    className="gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    Woman
                  </Button>
                </div>
                
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Find engineer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>
              </div>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-48">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <SelectValue placeholder="Location..." />
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
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600">No.</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600">Engineer Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600">Engineer ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600">Expertise</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600">Location</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600">Rating</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600">Projects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedEngineers.map((engineer, index) => (
                <tr
                  key={engineer.id}
                  onClick={() => onEngineerClick(engineer.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-center">
                    <TrophyRank rank={startIndex + index + 1} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={engineer.profileImage} alt={engineer.name} />
                        <AvatarFallback>
                          {engineer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{engineer.name}</p>
                        <p className="text-xs text-gray-600">{engineer.experience}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">
                        ENG{engineer.id.padStart(3, '0')}
                      </span>
                      <PerformanceChartPopover engineer={engineer}>
                        <div className="cursor-pointer">
                          <PerformanceIndicator change={engineer.rankingChange} />
                        </div>
                      </PerformanceChartPopover>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{engineer.expertise}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{engineer.location.split(',')[0]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-gray-900">{Math.round(engineer.rating * 100)}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-gray-600">{engineer.projects}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
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
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="px-2 py-1 text-sm text-gray-600">...</span>}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-8 h-8 p-0"
                >
                  {totalPages}
                </Button>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RankingPage() {
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);

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
    <EngineersTable 
      engineers={allEngineers} 
      onEngineerClick={handleEngineerClick} 
    />
  );
}
