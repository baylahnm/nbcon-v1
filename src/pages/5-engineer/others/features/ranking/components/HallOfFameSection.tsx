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
    <Card
      id="hall-of-fame"
      className="gap-0 mt-8"
      style={{
        border: '2px solid transparent',
        borderRadius: '0.75rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      <CardHeader className="p-5 pb-3 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Hall of Fame</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Annual award winners who set the standard for engineering excellence
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5 bg-background rounded-b-xl">

        {/* Year Tabs (Future: add 2023, 2022, All-Time) */}
        <div className="flex items-center justify-center gap-2">
          <Button variant="default" size="sm" className="h-7 text-[11px]">
            <Calendar className="h-3 w-3 mr-1" />
            2024 Winners
          </Button>
          <Button variant="outline" size="sm" disabled className="h-7 text-[11px]">
            2023
          </Button>
          <Button variant="outline" size="sm" disabled className="h-7 text-[11px]">
            2022
          </Button>
          <Button variant="outline" size="sm" disabled className="h-7 text-[11px]">
            All-Time Legends
          </Button>
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockWinners.map((winner) => {
          const config = getTierConfig(winner.tier);
          
          return (
            <Card 
              key={winner.engineer.id}
              className={`gap-0 relative overflow-hidden border-2 ${config.border} bg-gradient-to-br ${config.gradient} hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
            >
              {/* Floating Badge */}
              <div className="absolute -top-2.5 -right-2.5 z-10">
                <Badge className={`${config.badge} border-0 shadow-md font-bold text-[10px] px-2.5 py-1 ring-2 ring-background`}>
                  {winner.year} {winner.tier.toUpperCase()} {config.medal}
                </Badge>
              </div>

              <CardContent className="p-4 bg-background rounded-xl">
                {/* Engineer Info */}
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="h-14 w-14 ring-2 ring-background shadow-md">
                    <AvatarImage src={winner.engineer.avatar} alt={winner.engineer.name} />
                    <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                      {winner.engineer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold leading-tight mb-0.5 truncate">
                      {winner.engineer.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {winner.engineer.specialty}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {winner.engineer.company}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-1.5 rounded-md bg-white/60 border border-border/30">
                    <div className="flex items-center justify-center gap-0.5 mb-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold">{winner.finalRating.toFixed(1)}</span>
                    </div>
                    <p className="text-[8px] text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center p-1.5 rounded-md bg-white/60 border border-border/30">
                    <div className="flex items-center justify-center gap-0.5 mb-0.5">
                      <Briefcase className="h-3 w-3 text-primary" />
                      <span className="text-xs font-bold">{winner.totalProjects}</span>
                    </div>
                    <p className="text-[8px] text-muted-foreground">Projects</p>
                  </div>
                  <div className="text-center p-1.5 rounded-md bg-white/60 border border-border/30">
                    <span className="text-xs font-bold">{winner.finalScore}</span>
                    <p className="text-[8px] text-muted-foreground">Score</p>
                  </div>
                </div>

                {/* Prizes Won */}
                <div className={`p-2.5 rounded-md border ${config.border} bg-white/40 mb-3`}>
                  <h4 className="text-[10px] font-semibold mb-1.5 flex items-center gap-1">
                    <Gift className="h-3 w-3" />
                    Prizes Awarded:
                  </h4>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-medium">💵 SAR {winner.prizes.cash.toLocaleString()}</p>
                    <p className="text-[9px] font-medium">🚗 {winner.prizes.physical}</p>
                    <p className="text-[9px] font-medium">📚 {winner.prizes.courses} Premium Courses</p>
                  </div>
                </div>

                {/* Testimonial */}
                <blockquote className={`p-2.5 border-l-2 ${config.border} bg-muted/30 rounded-r-md mb-3`}>
                  <p className="text-[9px] italic leading-relaxed line-clamp-3">
                    "{winner.testimonial}"
                  </p>
                </blockquote>

                {/* View Profile Button */}
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full h-7 text-[11px]"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
          );
        })}
        </div>

        {/* Additional Past Winners Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="gap-0 border border-orange-600/30 bg-gradient-to-br from-orange-600/10 to-transparent hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center bg-background rounded-xl">
              <p className="text-[10px] text-muted-foreground mb-1.5">Bronze Tier (#4-10)</p>
              <p className="text-xl font-bold mb-1">7 Engineers</p>
              <p className="text-[9px] text-muted-foreground">SAR 25,000 + iPad + Courses each</p>
            </CardContent>
          </Card>

          <Card className="gap-0 border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center bg-background rounded-xl">
              <p className="text-[10px] text-muted-foreground mb-1.5">Platinum Tier (#11-25)</p>
              <p className="text-xl font-bold mb-1">15 Engineers</p>
              <p className="text-[9px] text-muted-foreground">SAR 10,000 + Courses each</p>
            </CardContent>
          </Card>

          <Card className="gap-0 border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center bg-background rounded-xl">
              <p className="text-[10px] text-muted-foreground mb-1.5">Star Tier (#26-50)</p>
              <p className="text-xl font-bold mb-1">25 Engineers</p>
              <p className="text-[9px] text-muted-foreground">Course Bundle + Certificate</p>
            </CardContent>
          </Card>
        </div>

        {/* Download Certificate */}
        <div className="text-center">
          <Button variant="outline" size="sm" className="h-7 text-[11px]">
            <Award className="h-3 w-3 mr-1" />
            Download 2024 Winners Certificate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

