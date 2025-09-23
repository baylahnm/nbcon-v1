import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Heart,
  MessageSquare,
  CheckCircle2,
  Briefcase,
  Users
} from 'lucide-react';

interface Engineer {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  bio: string;
  location_city: string;
  location_region: string;
  avatar_url?: string;
  specializations: string[];
  years_experience: number;
  hourly_rate?: number;
  daily_rate?: number;
  availability_status: string;
  sce_license_number?: string;
}

const specializations = [
  'Civil Engineering', 'Structural Engineering', 'Mechanical Engineering',
  'Electrical Engineering', 'Environmental Engineering', 'Geotechnical Engineering',
  'Transportation Engineering', 'Water Resources Engineering', 'Construction Management'
];

const availabilityOptions = [
  { value: 'available', label: 'Available Now' },
  { value: 'busy', label: 'Busy' },
  { value: 'unavailable', label: 'Unavailable' }
];

export default function BrowseEngineers() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchEngineers();
  }, []);

  const fetchEngineers = async () => {
    try {
      setIsLoading(true);
      
      // Join profiles with engineer_profiles to get complete data
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          engineer_profiles!inner(*)
        `)
        .eq('role', 'engineer');

      if (error) throw error;

      // Transform the data to flatten the engineer profile info
      const transformedEngineers = data.map(profile => ({
        id: profile.id,
        user_id: profile.user_id,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        location_city: profile.location_city || '',
        location_region: profile.location_region || '',
        avatar_url: profile.avatar_url,
        specializations: profile.engineer_profiles?.specializations || [],
        years_experience: profile.engineer_profiles?.years_experience || 0,
        hourly_rate: profile.engineer_profiles?.hourly_rate,
        daily_rate: profile.engineer_profiles?.daily_rate,
        availability_status: profile.engineer_profiles?.availability_status || 'available',
        sce_license_number: profile.engineer_profiles?.sce_license_number,
      }));

      setEngineers(transformedEngineers);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load engineers. Please try again.",
        variant: "destructive",
      });
      console.error('Error fetching engineers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEngineers = engineers.filter(engineer => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      `${engineer.first_name} ${engineer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
      engineer.bio.toLowerCase().includes(searchTerm.toLowerCase());

    // Specialization filter
    const matchesSpecialization = !selectedSpecialization || 
      engineer.specializations.includes(selectedSpecialization);

    // Availability filter
    const matchesAvailability = !selectedAvailability || 
      engineer.availability_status === selectedAvailability;

    // Price range filter
    const matchesPriceRange = (!priceRange.min || !engineer.hourly_rate || engineer.hourly_rate >= parseFloat(priceRange.min)) &&
      (!priceRange.max || !engineer.hourly_rate || engineer.hourly_rate <= parseFloat(priceRange.max));

    return matchesSearch && matchesSpecialization && matchesAvailability && matchesPriceRange;
  });

  const toggleFavorite = (engineerId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(engineerId)) {
        newFavorites.delete(engineerId);
        toast({
          title: "Removed from favorites",
          description: "Engineer removed from your favorites list.",
        });
      } else {
        newFavorites.add(engineerId);
        toast({
          title: "Added to favorites",
          description: "Engineer added to your favorites list.",
        });
      }
      return newFavorites;
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'EN';
  };

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-success text-success-foreground">Available</Badge>;
      case 'busy':
        return <Badge variant="default" className="bg-warning text-warning-foreground">Busy</Badge>;
      case 'unavailable':
        return <Badge variant="secondary">Unavailable</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('');
    setSelectedAvailability('');
    setPriceRange({ min: '', max: '' });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Find Engineers</h1>
            <p className="text-muted-foreground">Discover qualified engineering professionals</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Find Engineers
          </h1>
          <p className="text-muted-foreground">
            Discover qualified engineering professionals for your projects
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredEngineers.length} engineers found
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, skills, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Advanced Filters Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Advanced Filters</SheetTitle>
                    <SheetDescription>
                      Refine your search with additional criteria
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="space-y-6 mt-6">
                    <div>
                      <Label className="text-base font-medium">Price Range (SAR/hour)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Input
                          placeholder="Min"
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        />
                        <Input
                          placeholder="Max"
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        />
                      </div>
                    </div>

                    <Separator />

                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engineers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEngineers.map((engineer) => (
          <Card key={engineer.id} className="hover:shadow-medium transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(engineer.first_name, engineer.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {engineer.first_name} {engineer.last_name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {engineer.sce_license_number && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current text-accent" />
                        <span className="text-sm text-muted-foreground">4.8 (23)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(engineer.id)}
                  className={favorites.has(engineer.id) ? 'text-destructive' : ''}
                >
                  <Heart className={`h-4 w-4 ${favorites.has(engineer.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Specializations */}
              <div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {engineer.specializations.slice(0, 2).map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {engineer.specializations.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{engineer.specializations.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {engineer.bio || "Experienced engineering professional ready to help with your projects."}
              </p>

              {/* Location and Experience */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{engineer.location_city || 'Saudi Arabia'}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{engineer.years_experience}+ years</span>
                </div>
              </div>

              {/* Availability and Rate */}
              <div className="flex items-center justify-between">
                {getAvailabilityBadge(engineer.availability_status)}
                {engineer.hourly_rate && (
                  <div className="flex items-center gap-1 text-sm font-medium text-primary">
                    <DollarSign className="h-3 w-3" />
                    <span>SAR {engineer.hourly_rate}/hr</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Briefcase className="h-3 w-3 mr-1" />
                  View Profile
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-primary">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEngineers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No engineers found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters to find more engineers.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}