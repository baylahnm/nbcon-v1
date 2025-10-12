import { useState, useEffect } from 'react';
import { Trophy, Gift, Clock, Calendar, MapPin, ExternalLink, Sparkles, Car, BookOpen, Award, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';

export function AnnualPrizesHero() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Awards ceremony date: December 31, 2025
  const awardsDate = new Date('2025-12-31T19:00:00+03:00'); // 7 PM Saudi Time

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = awardsDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  const prizeTiers = [
    {
      id: 'gold',
      name: 'GOLD',
      icon: Trophy,
      rank: '#1',
      iconColor: 'text-amber-600',
      bgGradient: 'from-amber-500/20 via-amber-500/10 to-amber-500/5',
      borderColor: 'border-amber-500/40',
      ringColor: 'ring-amber-500/30',
      prizes: [
        { icon: Gift, label: 'SAR 100,000', description: 'Cash Prize' },
        { icon: Car, label: 'Tesla Model Y', description: 'or equivalent' },
        { icon: BookOpen, label: '12 Courses', description: 'Premium Bundle' },
        { icon: Sparkles, label: 'VIP Badge', description: '1 Year' }
      ]
    },
    {
      id: 'silver',
      name: 'SILVER',
      icon: Award,
      rank: '#2-3',
      iconColor: 'text-gray-600',
      bgGradient: 'from-gray-400/20 via-gray-400/10 to-gray-400/5',
      borderColor: 'border-gray-400/40',
      ringColor: 'ring-gray-400/30',
      prizes: [
        { icon: Gift, label: 'SAR 50,000', description: 'Cash Prize' },
        { icon: BookOpen, label: 'MacBook Pro', description: 'M3 or equivalent' },
        { icon: BookOpen, label: '8 Courses', description: 'Pro Bundle' },
        { icon: Award, label: 'Silver Badge', description: '1 Year' }
      ]
    },
    {
      id: 'bronze',
      name: 'BRONZE',
      icon: Award,
      rank: '#4-10',
      iconColor: 'text-orange-700',
      bgGradient: 'from-orange-600/20 via-orange-600/10 to-orange-600/5',
      borderColor: 'border-orange-600/40',
      ringColor: 'ring-orange-600/30',
      prizes: [
        { icon: Gift, label: 'SAR 25,000', description: 'Cash Prize' },
        { icon: BookOpen, label: 'iPad Pro', description: 'or equivalent' },
        { icon: BookOpen, label: '5 Courses', description: 'Course Bundle' },
        { icon: Award, label: 'Bronze Badge', description: '1 Year' }
      ]
    },
    {
      id: 'platinum',
      name: 'PLATINUM',
      icon: Sparkles,
      rank: '#11-25',
      iconColor: 'text-purple-600',
      bgGradient: 'from-purple-500/20 via-purple-500/10 to-purple-500/5',
      borderColor: 'border-purple-500/40',
      ringColor: 'ring-purple-500/30',
      prizes: [
        { icon: Gift, label: 'SAR 10,000', description: 'Cash Prize' },
        { icon: BookOpen, label: '3 Courses', description: 'Course Bundle' },
        { icon: Award, label: 'Platinum Badge', description: '1 Year' }
      ]
    },
    {
      id: 'star',
      name: 'STAR',
      icon: Sparkles,
      rank: '#26-50',
      iconColor: 'text-blue-600',
      bgGradient: 'from-blue-500/20 via-blue-500/10 to-blue-500/5',
      borderColor: 'border-blue-500/40',
      ringColor: 'ring-blue-500/30',
      prizes: [
        { icon: BookOpen, label: '1 Course', description: 'Your Choice' },
        { icon: Award, label: 'Certificate', description: 'Excellence Award' }
      ]
    }
  ];

  return (
    <Card 
      className="gap-0 overflow-hidden border-border/50"
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
            <h2 className="text-base font-bold tracking-tight">2025 Annual Engineering Excellence Awards</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Compete for over SAR 2,000,000 in prizes and recognition
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-6 bg-background rounded-b-xl">

          {/* Countdown Timer */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-2 border-amber-500/40">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-bold text-amber-900">Awards Ceremony Countdown</h3>
            </div>
            <div className="flex items-center justify-center gap-4">
              {[
                { value: timeRemaining.days, label: 'Days' },
                { value: timeRemaining.hours, label: 'Hours' },
                { value: timeRemaining.minutes, label: 'Minutes' },
                { value: timeRemaining.seconds, label: 'Seconds' }
              ].map((unit, index) => (
                <div key={unit.label} className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="bg-amber-600 text-white px-3 py-2 rounded-lg shadow-md min-w-[60px]">
                      <div className="text-2xl font-bold tabular-nums">{unit.value.toString().padStart(2, '0')}</div>
                    </div>
                    <div className="text-[10px] text-amber-900 font-medium mt-1.5">{unit.label}</div>
                  </div>
                  {index < 3 && <div className="text-xl font-bold text-amber-600">:</div>}
                </div>
              ))}
            </div>
            <div className="text-center mt-3 space-y-1">
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-amber-900">
                <Calendar className="h-3 w-3" />
                <span>December 31, 2025 • 7:00 PM (Saudi Arabia Time)</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Riyadh International Convention Center</span>
              </div>
            </div>
          </div>

          {/* Prize Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {prizeTiers.map((tier) => {
              const TierIcon = tier.icon;
              
              return (
                <Card 
                  key={tier.id}
                  className={`gap-0 group relative overflow-hidden border-2 ${tier.borderColor} bg-gradient-to-br ${tier.bgGradient} hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
                >
                  <CardContent className="p-4 bg-background rounded-xl">
                    {/* Tier Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`${tier.iconColor} bg-white/80 border-0 ring-1 ${tier.ringColor} text-[10px] px-2 py-0.5 font-bold`}>
                        {tier.rank}
                      </Badge>
                      <div className={`bg-white/80 p-1.5 rounded-lg ring-1 ${tier.ringColor}`}>
                        <TierIcon className={`h-4 w-4 ${tier.iconColor}`} />
                      </div>
                    </div>

                    {/* Tier Name */}
                    <h3 className={`text-base font-bold mb-3 ${tier.iconColor}`}>
                      {tier.name}
                    </h3>

                    {/* Prizes */}
                    <div className="space-y-2">
                      {tier.prizes.map((prize, idx) => {
                        const PrizeIcon = prize.icon;
                        return (
                          <div key={idx} className="flex items-start gap-1.5">
                            <PrizeIcon className={`h-3 w-3 ${tier.iconColor} mt-0.5 flex-shrink-0`} />
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold truncate">{prize.label}</p>
                              <p className="text-[9px] text-muted-foreground truncate">{prize.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-[11px]">
              <Gift className="h-3 w-3 mr-1" />
              View Prize Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const event = new CustomEvent('openRankingModal');
                window.dispatchEvent(event);
              }}
              className="h-7 text-[11px]"
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              See Ranking Criteria
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                document.getElementById('hall-of-fame')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-7 text-[11px]"
            >
              <Trophy className="h-3 w-3 mr-1" />
              Hall of Fame
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px]">
              <ExternalLink className="h-3 w-3 mr-1" />
              Eligibility Requirements
            </Button>
          </div>

          {/* Footer Note */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-[10px] text-center text-muted-foreground">
              <strong>Total Prize Pool: SAR 2,000,000+</strong> • Top 50 Engineers Eligible • Rankings Freeze: December 20, 2025
            </p>
          </div>
      </CardContent>
    </Card>
  );
}

