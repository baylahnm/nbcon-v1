import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  ArrowLeft, 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Mail, 
  Linkedin, 
  Twitter,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  BarChart3
} from "lucide-react";
import { Engineer } from "../../data/engineers";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface EngineerProfileProps {
  engineer: Engineer;
  onBack: () => void;
}

export function EngineerProfile({ engineer, onBack }: EngineerProfileProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "certifications">("overview");

  // Prepare chart data for 6-month ranking history
  const chartData = engineer.rankingHistory.map(item => ({
    month: item.month.split(' ')[0], // Just the month
    rank: item.rank
  })).reverse(); // Show chronological order

  // Trophy component for rank display
  const RankTrophy = ({ rank }: { rank: number }) => {
    if (rank === 1) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl">
            🏆
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">#{rank}</div>
            <div className="text-sm text-gray-600">Current Rank</div>
          </div>
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-2xl">
            🥈
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">#{rank}</div>
            <div className="text-sm text-gray-600">Current Rank</div>
          </div>
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-2xl">
            🥉
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">#{rank}</div>
            <div className="text-sm text-gray-600">Current Rank</div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-xl font-bold text-gray-700">#{rank}</span>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">#{rank}</div>
          <div className="text-sm text-gray-600">Current Rank</div>
        </div>
      </div>
    );
  };

  // Performance change badge
  const PerformanceBadge = ({ change }: { change: number }) => {
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          +{change} positions
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          <TrendingDown className="w-4 h-4" />
          {change} positions
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
          <BarChart3 className="w-4 h-4" />
          No change
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Rankings
          </Button>
        </div>

        <div className="flex items-start gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={engineer.profileImage} alt={engineer.name} />
            <AvatarFallback className="text-2xl">
              {engineer.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{engineer.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{engineer.expertise}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {engineer.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {engineer.experience}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <RankTrophy rank={engineer.rank} />
                <div className="mt-2">
                  <PerformanceBadge change={engineer.rankingChange} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats and Performance */}
          <div className="lg:col-span-1 space-y-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  6-Month Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis reversed domain={[1, 20]} />
                      <Tooltip 
                        formatter={(value: number) => [`#${value}`, 'Rank']}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rank" 
                        stroke={engineer.rankingChange >= 0 ? "#16a34a" : "#dc2626"} 
                        strokeWidth={3}
                        dot={{ fill: engineer.rankingChange >= 0 ? "#16a34a" : "#dc2626", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Best Rank: #{Math.min(...engineer.rankingHistory.map(h => h.rank))}</span>
                    <span>Average: #{Math.round(engineer.rankingHistory.reduce((sum, h) => sum + h.rank, 0) / engineer.rankingHistory.length)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{Math.round(engineer.rating * 100)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Projects</span>
                  <span className="font-semibold">{engineer.projects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="font-semibold">{engineer.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Certifications</span>
                  <span className="font-semibold">{engineer.certifications.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{engineer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <a href={engineer.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    LinkedIn Profile
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
                  activeTab === "overview"
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Overview
                {activeTab === "overview" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
                  activeTab === "projects"
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Projects
                {activeTab === "projects" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("certifications")}
                className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
                  activeTab === "certifications"
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Certifications
                {activeTab === "certifications" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Biography */}
                <Card>
                  <CardHeader>
                    <CardTitle>Biography</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{engineer.bio}</p>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {engineer.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Education */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {engineer.education.map((edu, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <span className="text-gray-700">{edu}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Major Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {engineer.majorProjects.map((project, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{project.name}</h4>
                          <p className="text-gray-600 mb-2">{project.description}</p>
                          <span className="text-sm text-gray-500">{project.year}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "certifications" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {engineer.certificationsDetailed.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                            <p className="text-sm text-gray-600">{cert.organization}</p>
                          </div>
                          <span className="text-sm text-gray-500">{cert.year}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
