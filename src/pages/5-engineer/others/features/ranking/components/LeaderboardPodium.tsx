import { Trophy, Award, Star, Briefcase, MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
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
        className={`group relative cursor-pointer overflow-hidden border-2 ${config.border} bg-gradient-to-br ${config.gradient} hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${config.height} ${config.zIndex} ${config.scale}`}
      >
        {/* Floating Medal */}
        <div className="absolute -top-4 -right-4 text-5xl transform rotate-12 group-hover:rotate-0 group-hover:scale-125 transition-transform duration-300">
          {config.medal}
        </div>

        <CardContent className="p-6 h-full flex flex-col justify-between">
          {/* Rank Badge */}
          <div className="flex justify-between items-start mb-4">
            <Badge className={`${config.badge} border-0 ring-2 ${config.ring} text-xs px-2.5 py-1 font-bold shadow-lg`}>
              #{rank}
            </Badge>
            {rankChange !== 0 && (
              <div className={`flex items-center gap-1 text-xs font-medium ${rankChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
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
            <Avatar className={`h-20 w-20 ring-4 ${config.ring} shadow-xl group-hover:scale-110 transition-transform`}>
              <AvatarImage src={engineer.profileImage} alt={engineer.name} />
              <AvatarFallback className="text-lg font-bold">
                {engineer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            {/* Name & Age */}
            <div>
              <h3 className="text-base font-bold leading-tight mb-1">
                {engineer.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {engineer.experience}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {/* Rating */}
              <div className="text-center p-2 rounded-lg bg-white/50 border border-border/30">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-base font-bold">{engineer.rating.toFixed(1)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Rating</p>
              </div>

              {/* Projects */}
              <div className="text-center p-2 rounded-lg bg-white/50 border border-border/30">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Briefcase className="h-3 w-3 text-primary" />
                  <span className="text-base font-bold">{engineer.projects}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Projects</p>
              </div>
            </div>

            {/* Score */}
            <div className="w-full p-3 rounded-lg bg-white/60 border-2 border-border/40 shadow-sm">
              <p className="text-[10px] text-muted-foreground mb-1">Total Score</p>
              <p className="text-2xl font-bold">{score}</p>
              <p className="text-[9px] text-muted-foreground">out of 1000</p>
            </div>

            {/* Specialty & Location */}
            <div className="space-y-1.5 w-full">
              <div className="flex items-center justify-center gap-1.5 text-xs">
                <Award className="h-3 w-3 text-primary flex-shrink-0" />
                <span className="font-medium truncate">{engineer.expertise}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{engineer.location.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {/* View Profile Button */}
          <button className="w-full mt-4 py-2 px-3 text-xs font-medium rounded-lg bg-white/80 hover:bg-white border border-border/40 hover:border-primary/40 transition-all shadow-sm hover:shadow-md">
            View Profile
          </button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mb-8">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <Trophy className="h-6 w-6 text-amber-600" />
          <h2 className="text-xl font-bold">Top 3 Champions</h2>
          <Trophy className="h-6 w-6 text-amber-600" />
        </div>
        <p className="text-xs text-muted-foreground">
          The elite engineers leading the 2025 rankings
        </p>
      </div>

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

      {/* Divider */}
      <div className="mt-8 mb-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <span className="text-xs font-medium text-muted-foreground px-3">Top 100 Leaderboard</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </div>
    </div>
  );
}

