import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProjectStore } from '@/hooks/useProjectStore';
import { useCurrency } from '@/hooks/useCurrency';
import { usePostProjectRouting } from '@/hooks/usePostProjectRouting';
import { PreviewTemplateButton, UseTemplateButton, PurchaseTemplateButton } from '@/components/PostProjectButtonHandler';
import { MarketplaceTemplate } from '@/types/project';
import { MOCK_MARKETPLACE_TEMPLATES, CATEGORIES, COMPLEXITY_LEVELS, INDUSTRIES } from '@/data/mockData';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Download,
  Building2,
  Clock,
  Users,
  Store,
  Plus,
  Eye,
  CheckCircle,
  X,
  TrendingUp,
  Award,
  Shield,
  DollarSign,
  Globe,
  FileText,
  Calendar,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TemplateMarketplaceTab: React.FC = () => {
  const { loadFromTemplate } = useProjectStore();
  const { currentCurrency, setCurrentCurrency, currencies, formatAmount } = useCurrency();
  const { handleUseTemplate, handlePreviewTemplate, handlePurchaseTemplate, setViewMode, clearFilters } = usePostProjectRouting();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>('grid');
  const [selectedTemplate, setSelectedTemplate] = useState<MarketplaceTemplate | null>(null);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = MOCK_MARKETPLACE_TEMPLATES.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || selectedCategory === 'all' || template.category === selectedCategory;
      const matchesComplexity = !selectedComplexity || selectedComplexity === 'all' || template.complexity === selectedComplexity;
      const matchesIndustry = !selectedIndustry || selectedIndustry === 'all' || template.industry === selectedIndustry;
      
      const convertedPrice = currentCurrency.rate * template.price;
      const matchesPrice = convertedPrice >= priceRange.min && convertedPrice <= priceRange.max;
      
      const matchesRating = template.rating >= minRating;
      
      return matchesSearch && matchesCategory && matchesComplexity && matchesIndustry && matchesPrice && matchesRating;
    });

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.data.basics?.title || '').getTime() - new Date(a.data.basics?.title || '').getTime();
        case 'popularity':
        default:
          return b.downloads - a.downloads;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedComplexity, selectedIndustry, priceRange, minRating, sortBy, currentCurrency.rate]);

  const handleTemplateUse = (template: MarketplaceTemplate) => {
    handleUseTemplate(template);
  };

  const handleTemplatePreview = (template: MarketplaceTemplate) => {
    setSelectedTemplate(template);
  };

  const handleTemplatePurchase = (template: MarketplaceTemplate) => {
    handlePurchaseTemplate(template);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedComplexity('all');
    setSelectedIndustry('all');
    setPriceRange({ min: 0, max: 10000 });
    setMinRating(0);
    setSortBy('popularity');
    clearFilters();
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewModeState(mode);
    setViewMode(mode);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Professional Template Marketplace
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Discover and purchase high-quality project templates from verified professionals
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label>Currency:</Label>
              <Select value={currentCurrency.code} onValueChange={(value) => {
                const currency = currencies.find(c => c.code === value);
                if (currency) setCurrentCurrency(currency);
              }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>


      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates by name, category, industry, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Complexity</Label>
                <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All complexity levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All complexity levels</SelectItem>
                    {COMPLEXITY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All industries</SelectItem>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price Range ({currentCurrency.symbol})</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 10000 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <Select value={minRating.toString()} onValueChange={(value) => setMinRating(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters and Results Count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(searchTerm || (selectedCategory && selectedCategory !== 'all') || (selectedComplexity && selectedComplexity !== 'all') || (selectedIndustry && selectedIndustry !== 'all') || minRating > 0) && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear Filters
                  </Button>
                )}
                <span className="text-sm text-muted-foreground">
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewModeChange('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewModeChange('list')}
                >
                  List
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid/List */}
      <div className={cn(
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
      )}>
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{template.category}</Badge>
                      <Badge className={getComplexityColor(template.complexity)}>
                        {template.complexity}
                      </Badge>
                      {template.isFree && (
                        <Badge variant="secondary">Free</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{template.rating}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {template.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {template.industry}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    {template.downloads} downloads
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    {template.author.totalSales} sales
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Author */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {template.author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{template.author.name}</p>
                      {template.author.verified && (
                        <Shield className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-muted-foreground">{template.author.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xl font-bold">
                    {formatAmount(template.price, template.currency)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTemplatePreview(template)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleTemplatePurchase(template)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {template.isFree ? 'Get Free' : 'Purchase'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4">
              <Store className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">No templates found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse all templates
                </p>
              </div>
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl h-[100vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Template Preview: {selectedTemplate.name}
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="flex-1 pr-4 h-0 min-h-0">
              <div className="space-y-6 p-1">
                {/* Template Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{selectedTemplate.category}</Badge>
                          <Badge className={getComplexityColor(selectedTemplate.complexity)}>
                            {selectedTemplate.complexity}
                          </Badge>
                          {selectedTemplate.isFree && (
                            <Badge variant="secondary">Free</Badge>
                          )}
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">{selectedTemplate.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{selectedTemplate.description}</p>
                  </CardContent>
                </Card>

                {/* Project Basics Preview */}
                {selectedTemplate.data.basics && (
                  <Card>
                    <CardHeader>
                      <h4 className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Project Basics
                      </h4>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Category</Label>
                          <p className="text-sm">{selectedTemplate.data.basics.category}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Location</Label>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{selectedTemplate.data.basics.location}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Duration</Label>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">{selectedTemplate.data.basics.duration?.weeks} weeks</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Urgency</Label>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm capitalize">{selectedTemplate.data.basics.urgency}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Language</Label>
                          <p className="text-sm">{selectedTemplate.data.basics.language}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Budget Range</Label>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-sm">
                              {formatAmount(selectedTemplate.data.basics.budget?.min || 0)} - {formatAmount(selectedTemplate.data.basics.budget?.max || 0)} {selectedTemplate.data.basics.budget?.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Features */}
                <Card>
                  <CardHeader>
                    <h4 className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Template Features
                    </h4>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedTemplate.features.map((feature, index) => (
                        <li key={index} className="text-sm">{feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Author Information */}
                <Card>
                  <CardHeader>
                    <h4 className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Author Information
                    </h4>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-medium">
                          {selectedTemplate.author.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{selectedTemplate.author.name}</h5>
                          {selectedTemplate.author.verified && (
                            <Shield className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span>{selectedTemplate.author.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{selectedTemplate.author.totalSales} sales</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Close
              </Button>
              <Button onClick={() => {
                handleTemplateUse(selectedTemplate);
                setSelectedTemplate(null);
              }}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Use This Template
              </Button>
              <Button onClick={() => {
                handleTemplatePurchase(selectedTemplate);
                setSelectedTemplate(null);
              }}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {selectedTemplate.isFree ? 'Get Free' : 'Purchase'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TemplateMarketplaceTab;
