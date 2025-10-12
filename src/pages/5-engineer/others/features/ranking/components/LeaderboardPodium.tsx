import { Trophy, Award, Star, Briefcase, MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../../1-HomePage/others/components/ui/avatar';
import { Engineer } from '../../../../../1-HomePage/others/data/engineers';

interface LeaderboardPodiumProps {
  topThree: Engineer[];
  onEngineerClick: (engineerId: string) => void;
}

export function LeaderboardPodium({ topThree, onEngineerClick }: LeaderboardPodiumProps) {
  if (topThree.length < 3) return null;

  const [first, second, third] = topThree;

  const getPodiumCard = (engineer: Engineer, rank: number) => {
    const isFirst = rank === 1;
    const isSecond = rank === 2;
    const isThird = rank === 3;

    const config = isFirst 
      ? {
          medal: '🏆',
          gradient: 'from-amber-500/20 via-amber-500/10 to-amber-500/5',
          border: 'border-amber-500/40',
          ring: 'ring-amber-500/30',
          badge: 'bg-amber-500 text-white',
          height: 'md:h-[340px]',
          zIndex: 'z-30',
          scale: 'md:scale-110'
        }
      : isSecond
      ? {
          medal: '🥈',
          gradient: 'from-gray-400/20 via-gray-400/10 to-gray-400/5',
          border: 'border-gray-400/40',
          ring: 'ring-gray-400/30',
          badge: 'bg-gray-500 text-white',
          height: 'md:h-[310px]',
          zIndex: 'z-20',
          scale: 'md:scale-100'
        }
      : {
          medal: '🥉',
          gradient: 'from-orange-600/20 via-orange-600/10 to-orange-600/5',
          border: 'border-orange-600/40',
          ring: 'ring-orange-600/30',
          badge: 'bg-orange-700 text-white',
          height: 'md:h-[310px]',
          zIndex: 'z-10',
          scale: 'md:scale-100'
        };

    // Calculate mock score (0-1000)
    const score = Math.round(engineer.rating * 200) - 15 + rank * 5;
    const rankChange = engineer.rankingChange || 0;

    return (
      <Card 
        key={engineer.id}
        onClick={() => onEngineerClick(engineer.id)}
        className={`gap-0 group relative cursor-pointer overflow-hidden border-2 ${config.border} bg-gradient-to-br ${config.gradient} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${config.height} ${config.zIndex} ${config.scale}`}
      >
        {/* Floating Medal */}
        <div className="absolute -top-4 -right-4 text-5xl transform rotate-12 group-hover:rotate-0 group-hover:scale-125 transition-transform duration-300">
          {config.medal}
        </div>

        <CardContent className="p-5 h-full flex flex-col justify-between bg-background rounded-xl">
          {/* Rank Badge */}
          <div className="flex justify-between items-start mb-3">
            <Badge className={`${config.badge} border-0 ring-1 ${config.ring} text-[10px] px-2 py-0.5 font-bold shadow-md`}>
              #{rank}
            </Badge>
            {rankChange !== 0 && (
              <div className={`flex items-center gap-0.5 text-[10px] font-medium ${rankChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {rankChange > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3" />
                    <span>+{rankChange}</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3" />
                    <span>{rankChange}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Engineer Info */}
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Avatar */}
            <Avatar className={`h-16 w-16 ring-2 ${config.ring} shadow-md group-hover:scale-110 transition-transform`}>
              <AvatarImage src={engineer.profileImage} alt={engineer.name} />
              <AvatarFallback className="text-base font-bold">
                {engineer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            {/* Name & Age */}
            <div>
              <h3 className="text-sm font-bold leading-tight mb-0.5">
                {engineer.name}
              </h3>
              <p className="text-[10px] text-muted-foreground">
                {engineer.experience}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 w-full">
              {/* Rating */}
              <div className="text-center p-1.5 rounded-md bg-white/50 border border-border/30">
                <div className="flex items-center justify-center gap-0.5 mb-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold">{engineer.rating.toFixed(1)}</span>
                </div>
                <p className="text-[9px] text-muted-foreground">Rating</p>
              </div>

              {/* Projects */}
              <div className="text-center p-1.5 rounded-md bg-white/50 border border-border/30">
                <div className="flex items-center justify-center gap-0.5 mb-0.5">
                  <Briefcase className="h-3 w-3 text-primary" />
                  <span className="text-sm font-bold">{engineer.projects}</span>
                </div>
                <p className="text-[9px] text-muted-foreground">Projects</p>
              </div>
            </div>

            {/* Score */}
            <div className="w-full p-2 rounded-md bg-white/60 border border-border/40">
              <p className="text-[9px] text-muted-foreground mb-0.5">Total Score</p>
              <p className="text-xl font-bold">{score}</p>
              <p className="text-[8px] text-muted-foreground">out of 1000</p>
            </div>

            {/* Specialty & Location */}
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-center gap-1 text-[10px]">
                <Award className="h-3 w-3 text-primary flex-shrink-0" />
                <span className="font-medium truncate">{engineer.expertise}</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{engineer.location.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {/* View Profile Button */}
          <button className="w-full mt-3 py-1.5 px-3 text-[10px] font-medium rounded-md bg-white/80 hover:bg-white border border-border/40 hover:border-primary/40 transition-all">
            View Profile
          </button>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card
      className="gap-0 mb-8"
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
            <h2 className="text-base font-bold tracking-tight">Top 3 Champions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              The elite engineers leading the 2025 rankings
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5 bg-background rounded-b-xl">

        {/* Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 md:items-end">
          {/* Second Place */}
          <div className="md:order-1">
            {getPodiumCard(second, 2)}
          </div>

          {/* First Place (Center, Elevated) */}
          <div className="md:order-2">
            {getPodiumCard(first, 1)}
          </div>

          {/* Third Place */}
          <div className="md:order-3">
            {getPodiumCard(third, 3)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

