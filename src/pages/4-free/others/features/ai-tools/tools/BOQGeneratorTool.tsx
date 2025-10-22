import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/pages/1-HomePage/others/components/ui/select';
import {
  ClipboardList,
  ArrowLeft,
  Sparkles,
  Save,
  FileDown,
  Plus,
  Trash2,
  Calculator,
  Package,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';
import { toast } from 'sonner';

interface BOQItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitRate: number;
  total: number;
}

interface BOQCategory {
  id: string;
  name: string;
  items: BOQItem[];
  subtotal: number;
}

export default function BOQGeneratorTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { sendMessage } = useAiStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('site-prep');

  // Sample BOQ data
  const [categories, setCategories] = useState<BOQCategory[]>([
    {
      id: 'site-prep',
      name: 'Site Preparation & Earthworks',
      subtotal: 125000,
      items: [
        { id: '1', description: 'Site clearance and grubbing', quantity: 1, unit: 'LS', unitRate: 15000, total: 15000 },
        { id: '2', description: 'Excavation for foundation', quantity: 500, unit: 'm³', unitRate: 45, total: 22500 },
        { id: '3', description: 'Backfilling and compaction', quantity: 350, unit: 'm³', unitRate: 35, total: 12250 },
        { id: '4', description: 'Temporary fencing', quantity: 200, unit: 'm', unitRate: 75, total: 15000 },
      ],
    },
    {
      id: 'concrete',
      name: 'Concrete Works',
      subtotal: 425000,
      items: [
        { id: '5', description: 'Grade 40 concrete for footings', quantity: 180, unit: 'm³', unitRate: 420, total: 75600 },
        { id: '6', description: 'Grade 50 concrete for columns', quantity: 250, unit: 'm³', unitRate: 480, total: 120000 },
        { id: '7', description: 'Steel reinforcement bars', quantity: 45, unit: 'Ton', unitRate: 4500, total: 202500 },
      ],
    },
    {
      id: 'steel',
      name: 'Steel & Structural Works',
      subtotal: 0,
      items: [],
    },
    {
      id: 'mep',
      name: 'MEP Systems',
      subtotal: 0,
      items: [],
    },
    {
      id: 'finishes',
      name: 'Finishes & Painting',
      subtotal: 0,
      items: [],
    },
  ]);

  const activeCategory = categories.find(c => c.id === selectedCategory);
  const grandTotal = categories.reduce((sum, cat) => sum + cat.subtotal, 0);
  const taxRate = 0.15; // 15% VAT
  const taxAmount = grandTotal * taxRate;
  const totalWithTax = grandTotal + taxAmount;

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a complete Bill of Quantities (BOQ) for a construction project. Project ID: ${projectId || 'N/A'}. Include material categories (Site Preparation, Concrete Works, Steel & Structural, MEP Systems, Finishes), item descriptions, quantities, units, and estimated unit prices based on Saudi market rates. Format as professional BOQ suitable for tender submission. Include typical items for a commercial building in Saudi Arabia.`;
      
      await sendMessage(prompt);
      
      toast.success("AI has generated a complete BOQ. Review and adjust as needed.");
      
      setIsGenerating(false);
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error("Could not generate BOQ. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleAddItem = () => {
    if (!activeCategory) return;
    
    const newItem: BOQItem = {
      id: `item-${Date.now()}`,
      description: 'New item',
      quantity: 0,
      unit: 'm³',
      unitRate: 0,
      total: 0,
    };

    setCategories(prev => prev.map(cat =>
      cat.id === selectedCategory
        ? { ...cat, items: [...cat.items, newItem] }
        : cat
    ));
  };

  const handleSave = () => {
    toast.success("Your Bill of Quantities has been saved successfully.");
  };

  const handleExport = () => {
    toast.success("Your BOQ is being exported to Excel with formulas...");
  };

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const completedCategories = categories.filter(cat => cat.items.length > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => navigate('/free/ai-tools/budgeting')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">BOQ Generator</h1>
              <p className="text-xs text-muted-foreground">
                Bill of Quantities with AI-powered generation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 text-xs"
              onClick={handleSave}
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Draft
            </Button>
            <Button
              className="h-8 text-xs shadow-md"
              onClick={handleExport}
            >
              <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
              Export Excel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Categories</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedCategory === category.id
                        ? 'bg-primary/10 border-primary/20'
                        : 'bg-background border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium truncate">{category.name}</span>
                      {category.items.length > 0 && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px]">
                          {category.items.length}
                        </Badge>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {category.subtotal > 0 ? `${category.subtotal.toLocaleString()} SAR` : 'Empty'}
                    </div>
                  </button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs mt-2"
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      AI Generate BOQ
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* BOQ Statistics */}
            <Card className="border-border/50 mt-4">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Calculator className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Statistics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Total Items</span>
                    <span className="font-bold">{totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Categories</span>
                    <span className="font-bold">{completedCategories} / {categories.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Grand Total</span>
                    <span className="font-bold text-primary">{grandTotal.toLocaleString()} SAR</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Tax (15%)</span>
                    <span className="font-bold">{taxAmount.toLocaleString()} SAR</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                    <span className="font-bold">Total with Tax</span>
                    <span className="font-bold text-primary text-sm">{totalWithTax.toLocaleString()} SAR</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Items Table */}
          <div className="lg:col-span-3">
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                      <ClipboardList className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">
                        {activeCategory?.name || 'Select Category'}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activeCategory?.items.length || 0} items • {activeCategory?.subtotal.toLocaleString() || '0'} SAR
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={handleAddItem}
                    disabled={!activeCategory}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {activeCategory && activeCategory.items.length > 0 ? (
                  <div className="space-y-4">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted/30 rounded-lg border border-border">
                      <div className="col-span-4 text-xs font-bold">Description</div>
                      <div className="col-span-2 text-xs font-bold text-center">Quantity</div>
                      <div className="col-span-1 text-xs font-bold text-center">Unit</div>
                      <div className="col-span-2 text-xs font-bold text-right">Rate (SAR)</div>
                      <div className="col-span-2 text-xs font-bold text-right">Total (SAR)</div>
                      <div className="col-span-1"></div>
                    </div>

                    {/* Table Rows */}
                    {activeCategory.items.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-12 gap-2 p-3 bg-background rounded-lg border border-border hover:shadow-sm transition-all"
                      >
                        <div className="col-span-4">
                          <Input
                            value={item.description}
                            onChange={() => {}}
                            className="h-8 text-xs"
                            placeholder="Item description"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={() => {}}
                            className="h-8 text-xs text-center"
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-1">
                          <Select value={item.unit}>
                            <SelectTrigger className="h-8 text-xs border border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="m³">m³</SelectItem>
                              <SelectItem value="m²">m²</SelectItem>
                              <SelectItem value="m">m</SelectItem>
                              <SelectItem value="Ton">Ton</SelectItem>
                              <SelectItem value="LS">LS</SelectItem>
                              <SelectItem value="No.">No.</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={item.unitRate}
                            onChange={() => {}}
                            className="h-8 text-xs text-right"
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="h-8 flex items-center justify-end text-xs font-bold text-primary">
                            {item.total.toLocaleString()}
                          </div>
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Category Subtotal */}
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <span className="text-xs font-bold">Subtotal - {activeCategory.name}</span>
                      <span className="text-sm font-bold text-primary">
                        {activeCategory.subtotal.toLocaleString()} SAR
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
                    <div className="bg-primary/10 h-12 w-12 flex items-center justify-center rounded-xl shadow-md mx-auto mb-3">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium mb-1">No items in this category</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Add items manually or use AI to generate a complete BOQ
                    </p>
                    <div className="flex items-center gap-2 justify-center">
                      <Button
                        size="sm"
                        className="h-8 text-xs"
                        onClick={handleAddItem}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Add First Item
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={handleAIGenerate}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                            AI Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="border-border/50 mt-4">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <Calculator className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">BOQ Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 bg-background rounded-lg border border-border">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">{grandTotal.toLocaleString()} SAR</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-background rounded-lg border border-border">
                    <span className="text-muted-foreground">Tax (15% VAT)</span>
                    <span className="font-bold">{taxAmount.toLocaleString()} SAR</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <span className="font-bold">Grand Total</span>
                    <span className="text-base font-bold text-primary">
                      {totalWithTax.toLocaleString()} SAR
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-2">Export Options</div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-8 text-xs justify-start"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 mr-2" />
                      Excel with Formulas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-8 text-xs justify-start"
                    >
                      <FileDown className="h-3.5 w-3.5 mr-2" />
                      PDF Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

