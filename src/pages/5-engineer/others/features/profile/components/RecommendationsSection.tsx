import { useState } from 'react';
import { Star, ThumbsUp, Plus, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../1-HomePage/others/components/ui/tabs';
import { Avatar } from '../../../../../1-HomePage/others/components/ui/avatar';

interface RecommendationsSectionProps {
  reviews: any[]; // Array of reviews from Supabase
  averageRating: number;
  totalReviews: number;
  isEditMode?: boolean;
}

interface Recommendation {
  id: string;
  reviewerName: string;
  reviewerTitle: string;
  reviewerCompany: string;
  reviewerAvatar?: string;
  relationship: 'client' | 'colleague' | 'manager';
  overallRating: number;
  qualityRating: number;
  communicationRating: number;
  timelinessRating: number;
  valueRating: number;
  testimonial: string;
  associatedProject?: string;
  createdAt: string;
}

export function RecommendationsSection({ reviews, averageRating, totalReviews, isEditMode = false }: RecommendationsSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Transform Supabase reviews to component format
  const recommendations: Recommendation[] = reviews.length > 0 ? reviews.map(r => ({
    id: r.id,
    reviewerName: r.reviewer_name || 'Anonymous',
    reviewerTitle: 'Client', // Default
    reviewerCompany: r.reviewer_company || 'Company',
    relationship: 'client' as const,
    overallRating: r.overall_rating || 0,
    qualityRating: r.quality_rating || r.overall_rating || 0,
    communicationRating: r.communication_rating || r.overall_rating || 0,
    timelinessRating: r.timeliness_rating || r.overall_rating || 0,
    valueRating: r.overall_rating || 0,
    testimonial: r.review_text || 'No review text provided.',
    associatedProject: r.project_name || undefined,
    createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  })) : [
    {
      id: '1',
      reviewerName: 'Mohammed Al-Zahrani',
      reviewerTitle: 'Project Manager',
      reviewerCompany: 'NEOM Development Company',
      relationship: 'client',
      overallRating: 5.0,
      qualityRating: 5,
      communicationRating: 5,
      timelinessRating: 5,
      valueRating: 5,
      testimonial: "Ahmed's expertise in structural analysis was instrumental in the success of our infrastructure project. His attention to detail and ability to solve complex engineering challenges exceeded our expectations. Highly recommended!",
      associatedProject: 'NEOM Smart City Infrastructure Phase 1',
      createdAt: '2024-10-10'
    },
    {
      id: '2',
      reviewerName: 'Sarah Johnson',
      reviewerTitle: 'Senior Civil Engineer',
      reviewerCompany: 'Bechtel Corporation',
      relationship: 'colleague',
      overallRating: 5.0,
      qualityRating: 5,
      communicationRating: 5,
      timelinessRating: 4,
      valueRating: 5,
      testimonial: "I've worked alongside Ahmed on multiple projects. His technical knowledge and collaborative approach make him an outstanding engineer. Highly professional and delivers exceptional results consistently.",
      createdAt: '2024-09-15'
    },
    {
      id: '3',
      reviewerName: 'Fahad Al-Otaibi',
      reviewerTitle: 'Construction Director',
      reviewerCompany: 'Ministry of Sports',
      relationship: 'client',
      overallRating: 4.8,
      qualityRating: 5,
      communicationRating: 5,
      timelinessRating: 4,
      valueRating: 5,
      testimonial: "Ahmed provided excellent structural consulting for our stadium renovation project. His innovative solutions helped us meet tight deadlines while staying within budget.",
      associatedProject: 'King Fahd Stadium Renovation',
      createdAt: '2024-08-20'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All', count: recommendations.length },
    { value: 'client', label: 'Clients', count: recommendations.filter(r => r.relationship === 'client').length },
    { value: 'colleague', label: 'Engineers', count: recommendations.filter(r => r.relationship === 'colleague').length },
  ];

  const filteredRecommendations = selectedFilter === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.relationship === selectedFilter);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= rating 
                ? 'fill-amber-400 text-amber-400' 
                : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getRelationshipLabel = (relationship: string) => {
    const labels = {
      client: 'Client',
      colleague: 'Colleague',
      manager: 'Manager'
    };
    return labels[relationship as keyof typeof labels];
  };

  return (
    <Card className="gap-0 group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50">
      <CardHeader className="p-5 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/10 p-2.5 rounded-xl ring-1 ring-green-500/20 group-hover:scale-110 transition-transform">
            <ThumbsUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-bold">Recommendations & Reviews</h2>
              <p className="text-xs text-muted-foreground">{recommendations.length} reviews</p>
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-border/40">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-xl font-bold">{averageRating}</span>
              <span className="text-sm text-muted-foreground">/5.0</span>
            </div>
          </div>
        </div>
        {isEditMode && (
          <Button size="sm" variant="outline" className="text-xs h-8">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Request Review
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-5 space-y-6 bg-background rounded-b-xl">
        {/* Filter Tabs */}
        <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
          <TabsList className="w-full grid grid-cols-3 gap-0">
            {filterOptions.map((option) => (
              <TabsTrigger key={option.value} value={option.value} className="text-xs">
                {option.label}
                <Badge variant="outline" className="ml-1.5 text-[9px] px-1.5 py-0 h-4">
                  {option.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedFilter} className="mt-6 space-y-5">
            {filteredRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-lg border border-border/40 bg-gradient-to-br from-card to-card/50 hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                {/* Reviewer Info */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <Avatar className="h-12 w-12">
                    {rec.reviewerAvatar ? (
                      <img src={rec.reviewerAvatar} alt={rec.reviewerName} />
                    ) : (
                      <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {rec.reviewerName.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="text-sm font-semibold">{rec.reviewerName}</h4>
                        <p className="text-xs text-muted-foreground">
                          {rec.reviewerTitle} • {rec.reviewerCompany}
                        </p>
                      </div>
                      {/* Overall Rating */}
                      <div className="flex items-center gap-1.5">
                        {renderStars(rec.overallRating)}
                        <span className="text-sm font-bold ml-1">{rec.overallRating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                        {getRelationshipLabel(rec.relationship)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(rec.createdAt)}
                      </span>
                      {rec.associatedProject && (
                        <>
                          <span className="text-muted-foreground/60">•</span>
                          <span className="text-xs text-primary font-medium line-clamp-1">
                            {rec.associatedProject}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="mb-4 p-4 rounded-lg bg-muted/30 border border-border/20">
                  <p className="text-sm leading-relaxed italic text-foreground/80">
                    "{rec.testimonial}"
                  </p>
                </div>

                {/* Detailed Ratings */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Quality', value: rec.qualityRating },
                    { label: 'Communication', value: rec.communicationRating },
                    { label: 'Timeliness', value: rec.timelinessRating },
                    { label: 'Value', value: rec.valueRating }
                  ].map((rating) => (
                    <div key={rating.label} className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">{rating.label}</p>
                      {renderStars(rating.value)}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {!isEditMode && (
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/30">
                    <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
                      <ThumbsUp className="h-3 w-3 mr-1.5" />
                      Helpful
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {filteredRecommendations.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold mb-2">No {selectedFilter === 'all' ? '' : selectedFilter} reviews yet</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Request recommendations from clients and colleagues you've worked with
            </p>
            {isEditMode && (
              <Button size="sm" className="text-xs">
                <Plus className="h-3 w-3 mr-1.5" />
                Request Recommendation
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

