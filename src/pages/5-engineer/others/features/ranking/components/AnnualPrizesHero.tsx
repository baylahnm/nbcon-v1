import { useState, useEffect } from 'react';
import { Trophy, Gift, Clock, Calendar, MapPin, ExternalLink, Sparkles, Car, BookOpen, Award, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
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
    <div className="mb-8">
      <Card className="overflow-hidden border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent shadow-xl">
        <CardContent className="p-8">
          {/* Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <Gift className="h-8 w-8 text-amber-600" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                2025 ANNUAL ENGINEERING EXCELLENCE AWARDS
              </h2>
              <Gift className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              Compete for over SAR 2,000,000 in prizes and recognition
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-2 border-amber-500/40 shadow-md">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-amber-600" />
              <h3 className="text-base font-bold text-amber-900">Awards Ceremony Countdown</h3>
            </div>
            <div className="flex items-center justify-center gap-6">
              {[
                { value: timeRemaining.days, label: 'Days' },
                { value: timeRemaining.hours, label: 'Hours' },
                { value: timeRemaining.minutes, label: 'Minutes' },
                { value: timeRemaining.seconds, label: 'Seconds' }
              ].map((unit, index) => (
                <div key={unit.label} className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="bg-amber-600 text-white px-4 py-3 rounded-xl shadow-lg min-w-[70px]">
                      <div className="text-3xl font-bold tabular-nums">{unit.value.toString().padStart(2, '0')}</div>
                    </div>
                    <div className="text-xs text-amber-900 font-medium mt-2">{unit.label}</div>
                  </div>
                  {index < 3 && <div className="text-2xl font-bold text-amber-600">:</div>}
                </div>
              ))}
            </div>
            <div className="text-center mt-4 space-y-1">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-amber-900">
                <Calendar className="h-4 w-4" />
                <span>December 31, 2025 • 7:00 PM (Saudi Arabia Time)</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>Riyadh International Convention Center</span>
              </div>
            </div>
          </div>

          {/* Prize Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
            {prizeTiers.map((tier) => {
              const TierIcon = tier.icon;
              
              return (
                <Card 
                  key={tier.id}
                  className={`group relative overflow-hidden border-2 ${tier.borderColor} bg-gradient-to-br ${tier.bgGradient} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  <CardContent className="p-5">
                    {/* Tier Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`${tier.iconColor} bg-white/80 border-0 ring-2 ${tier.ringColor} text-xs px-2.5 py-1 font-bold`}>
                        {tier.rank}
                      </Badge>
                      <div className={`bg-white/80 p-2 rounded-lg ring-2 ${tier.ringColor}`}>
                        <TierIcon className={`h-5 w-5 ${tier.iconColor}`} />
                      </div>
                    </div>

                    {/* Tier Name */}
                    <h3 className={`text-lg font-bold mb-4 ${tier.iconColor}`}>
                      {tier.name}
                    </h3>

                    {/* Prizes */}
                    <div className="space-y-2.5">
                      {tier.prizes.map((prize, idx) => {
                        const PrizeIcon = prize.icon;
                        return (
                          <div key={idx} className="flex items-start gap-2">
                            <PrizeIcon className={`h-3.5 w-3.5 ${tier.iconColor} mt-0.5 flex-shrink-0`} />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">{prize.label}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{prize.description}</p>
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
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-xs h-9">
              <Gift className="h-3.5 w-3.5 mr-2" />
              View Prize Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const event = new CustomEvent('openRankingModal');
                window.dispatchEvent(event);
              }}
              className="shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-xs h-9"
            >
              <BarChart3 className="h-3.5 w-3.5 mr-2" />
              See Ranking Criteria
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                document.getElementById('hall-of-fame')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-xs h-9"
            >
              <Trophy className="h-3.5 w-3.5 mr-2" />
              Hall of Fame
            </Button>
            <Button size="sm" className="shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-xs h-9">
              <ExternalLink className="h-3.5 w-3.5 mr-2" />
              Eligibility Requirements
            </Button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-center text-amber-900">
              <strong>Total Prize Pool: SAR 2,000,000+</strong> • Top 50 Engineers Eligible • Rankings Freeze: December 20, 2025
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

