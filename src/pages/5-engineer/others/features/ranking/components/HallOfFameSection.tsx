import { Trophy, Star, Briefcase, MapPin, ExternalLink, Award, Gift, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../../1-HomePage/others/components/ui/avatar';

interface PastWinner {
  year: number;
  tier: 'gold' | 'silver' | 'bronze';
  rank: number;
  engineer: {
    id: string;
    name: string;
    avatar: string;
    specialty: string;
    company: string;
    location: string;
  };
  finalScore: number;
  finalRating: number;
  totalProjects: number;
  prizes: {
    cash: number;
    physical: string;
    courses: number;
  };
  testimonial: string;
}

const mockWinners: PastWinner[] = [
  {
    year: 2024,
    tier: 'gold',
    rank: 1,
    engineer: {
      id: 'ENG156',
      name: 'Mohammed Al-Zahrani',
      avatar: '',
      specialty: 'Structural Engineering',
      company: 'NEOM Development Company',
      location: 'Riyadh'
    },
    finalScore: 985,
    finalRating: 5.0,
    totalProjects: 189,
    prizes: {
      cash: 100000,
      physical: 'Tesla Model Y',
      courses: 12
    },
    testimonial: 'Exceptional work on NEOM Smart City infrastructure projects. Consistently delivered high-quality results with perfect client satisfaction.'
  },
  {
    year: 2024,
    tier: 'silver',
    rank: 2,
    engineer: {
      id: 'ENG089',
      name: 'Sarah Johnson',
      avatar: '',
      specialty: 'Project Management',
      company: 'Bechtel Corporation',
      location: 'Jeddah'
    },
    finalScore: 960,
    finalRating: 4.9,
    totalProjects: 142,
    prizes: {
      cash: 50000,
      physical: 'MacBook Pro M3',
      courses: 8
    },
    testimonial: 'Outstanding project leadership and exceptional client communication. Delivered complex projects ahead of schedule.'
  },
  {
    year: 2024,
    tier: 'silver',
    rank: 3,
    engineer: {
      id: 'ENG124',
      name: 'Fahad Al-Otaibi',
      avatar: '',
      specialty: 'Electrical Engineering',
      company: 'Saudi Aramco',
      location: 'Dhahran'
    },
    finalScore: 955,
    finalRating: 4.9,
    totalProjects: 167,
    prizes: {
      cash: 50000,
      physical: 'MacBook Pro M3',
      courses: 8
    },
    testimonial: 'Brilliant technical expertise and dedication to quality. Set new standards for electrical engineering excellence.'
  }
];

export function HallOfFameSection() {
  const getTierConfig = (tier: string) => {
    switch (tier) {
      case 'gold':
        return {
          medal: '🏆',
          gradient: 'from-amber-500/20 via-amber-500/10 to-amber-500/5',
          border: 'border-amber-500/40',
          badge: 'bg-amber-500 text-white',
          textColor: 'text-amber-900'
        };
      case 'silver':
        return {
          medal: '🥈',
          gradient: 'from-gray-400/20 via-gray-400/10 to-gray-400/5',
          border: 'border-gray-400/40',
          badge: 'bg-gray-500 text-white',
          textColor: 'text-gray-900'
        };
      case 'bronze':
        return {
          medal: '🥉',
          gradient: 'from-orange-600/20 via-orange-600/10 to-orange-600/5',
          border: 'border-orange-600/40',
          badge: 'bg-orange-700 text-white',
          textColor: 'text-orange-900'
        };
      default:
        return {
          medal: '⭐',
          gradient: 'from-primary/20 via-primary/10 to-primary/5',
          border: 'border-primary/40',
          badge: 'bg-primary text-white',
          textColor: 'text-primary'
        };
    }
  };

  return (
    <div id="hall-of-fame" className="mt-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <Trophy className="h-7 w-7 text-amber-600" />
          <h2 className="text-xl font-bold">Hall of Fame</h2>
          <Trophy className="h-7 w-7 text-amber-600" />
        </div>
        <p className="text-xs text-muted-foreground">
          Annual award winners who set the standard for engineering excellence
        </p>
      </div>

      {/* Year Tabs (Future: add 2023, 2022, All-Time) */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Button variant="default" size="sm" className="text-xs h-8">
          <Calendar className="h-3 w-3 mr-1.5" />
          2024 Winners
        </Button>
        <Button variant="outline" size="sm" disabled className="text-xs h-8">
          2023
        </Button>
        <Button variant="outline" size="sm" disabled className="text-xs h-8">
          2022
        </Button>
        <Button variant="outline" size="sm" disabled className="text-xs h-8">
          All-Time Legends
        </Button>
      </div>

      {/* Winners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockWinners.map((winner) => {
          const config = getTierConfig(winner.tier);
          
          return (
            <Card 
              key={winner.engineer.id}
              className={`relative overflow-hidden border-2 ${config.border} bg-gradient-to-br ${config.gradient} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              {/* Floating Badge */}
              <div className="absolute -top-3 -right-3 z-10">
                <Badge className={`${config.badge} border-0 shadow-xl font-bold text-xs px-3 py-1.5 ring-4 ring-background`}>
                  {winner.year} {winner.tier.toUpperCase()} {config.medal}
                </Badge>
              </div>

              <CardContent className="p-6">
                {/* Engineer Info */}
                <div className="flex items-start gap-4 mb-5">
                  <Avatar className="h-16 w-16 ring-4 ring-background shadow-lg">
                    <AvatarImage src={winner.engineer.avatar} alt={winner.engineer.name} />
                    <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
                      {winner.engineer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold leading-tight mb-1 truncate">
                      {winner.engineer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {winner.engineer.specialty}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {winner.engineer.company}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 rounded-lg bg-white/60 border border-border/30">
                    <div className="flex items-center justify-center gap-0.5 mb-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold">{winner.finalRating.toFixed(1)}</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/60 border border-border/30">
                    <div className="flex items-center justify-center gap-0.5 mb-1">
                      <Briefcase className="h-3 w-3 text-primary" />
                      <span className="text-sm font-bold">{winner.totalProjects}</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground">Projects</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/60 border border-border/30">
                    <span className="text-sm font-bold">{winner.finalScore}</span>
                    <p className="text-[9px] text-muted-foreground">Score</p>
                  </div>
                </div>

                {/* Prizes Won */}
                <div className={`p-3 rounded-lg border ${config.border} bg-white/40 mb-4`}>
                  <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <Gift className="h-3 w-3" />
                    Prizes Awarded:
                  </h4>
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium">💵 SAR {winner.prizes.cash.toLocaleString()}</p>
                    <p className="text-[10px] font-medium">🚗 {winner.prizes.physical}</p>
                    <p className="text-[10px] font-medium">📚 {winner.prizes.courses} Premium Courses</p>
                  </div>
                </div>

                {/* Testimonial */}
                <blockquote className={`p-3 border-l-4 ${config.border} bg-muted/30 rounded-r-lg mb-4`}>
                  <p className="text-[10px] italic leading-relaxed line-clamp-3">
                    "{winner.testimonial}"
                  </p>
                </blockquote>

                {/* View Profile Button */}
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-xs h-8"
                >
                  <ExternalLink className="h-3 w-3 mr-1.5" />
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Past Winners Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-orange-600/30 bg-gradient-to-br from-orange-600/10 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-5 text-center">
            <p className="text-xs text-muted-foreground mb-2">Bronze Tier (#4-10)</p>
            <p className="text-2xl font-bold mb-1">7 Engineers</p>
            <p className="text-[10px] text-muted-foreground">SAR 25,000 + iPad + Courses each</p>
          </CardContent>
        </Card>

        <Card className="border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-5 text-center">
            <p className="text-xs text-muted-foreground mb-2">Platinum Tier (#11-25)</p>
            <p className="text-2xl font-bold mb-1">15 Engineers</p>
            <p className="text-[10px] text-muted-foreground">SAR 10,000 + Courses each</p>
          </CardContent>
        </Card>

        <Card className="border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-5 text-center">
            <p className="text-xs text-muted-foreground mb-2">Star Tier (#26-50)</p>
            <p className="text-2xl font-bold mb-1">25 Engineers</p>
            <p className="text-[10px] text-muted-foreground">Course Bundle + Certificate</p>
          </CardContent>
        </Card>
      </div>

      {/* Download Certificate */}
      <div className="mt-6 text-center">
        <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all text-xs h-9">
          <Award className="h-3.5 w-3.5 mr-2" />
          Download 2024 Winners Certificate
        </Button>
      </div>
    </div>
  );
}

