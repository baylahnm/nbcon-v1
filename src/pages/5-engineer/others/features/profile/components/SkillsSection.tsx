import { useState } from 'react';
import { Wrench, ThumbsUp, Plus, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../1-HomePage/others/components/ui/tabs';

interface SkillsSectionProps {
  skills: any[]; // Array of skills from Supabase
  isEditMode?: boolean;
  onAddSkill?: (skillData: any) => Promise<{ success: boolean; error?: string }>;
}

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'software' | 'soft_skill';
  proficiency: 1 | 2 | 3 | 4 | 5;
  yearsExperience: number;
  endorsementCount: number;
  isVerified: boolean;
}

export function SkillsSection({ skills: rawSkills, isEditMode = false, onAddSkill }: SkillsSectionProps) {
  // Transform Supabase skills to component format
  const skills: Skill[] = rawSkills.length > 0 
    ? rawSkills.map(s => ({
        id: s.id,
        name: s.skill_name,
        category: (s.skill_category?.toLowerCase() || 'technical') as 'technical' | 'software' | 'soft_skill',
        proficiency: (s.proficiency_level || 3) as 1 | 2 | 3 | 4 | 5,
        yearsExperience: s.years_experience || 0,
        endorsementCount: 0, // Not tracked yet
        isVerified: s.is_verified || false,
      }))
    : [
        // Empty state - show one placeholder
        { id: 'placeholder', name: 'Add your first skill', category: 'technical' as const, proficiency: 3 as const, yearsExperience: 0, endorsementCount: 0, isVerified: false }
      ];

  const categorizedSkills = {
    technical: skills.filter(s => s.category === 'technical'),
    software: skills.filter(s => s.category === 'software'),
    soft_skill: skills.filter(s => s.category === 'soft_skill'),
  };

  const renderProficiencyDots = (level: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`h-1.5 w-1.5 rounded-full ${
              dot <= level ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderSkillCard = (skill: Skill) => (
    <div
      key={skill.id}
      className="group/skill p-4 rounded-lg border border-border/40 bg-gradient-to-br from-card to-card/50 hover:shadow-md hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold">{skill.name}</h4>
            {skill.isVerified && (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            )}
          </div>
          {renderProficiencyDots(skill.proficiency)}
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-7 px-2 text-xs opacity-0 group-hover/skill:opacity-100 transition-opacity"
        >
          <ThumbsUp className="h-3 w-3 mr-1" />
          Endorse
        </Button>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{skill.yearsExperience} years</span>
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-3 w-3" />
          <span>{skill.endorsementCount}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-2.5 rounded-xl ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform">
            <Wrench className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold">Skills & Expertise</h2>
            <p className="text-xs text-muted-foreground">{skills.length} total skills</p>
          </div>
        </div>
        {isEditMode && (
          <Button size="sm" variant="outline" className="text-xs h-8">
            <Plus className="h-3 w-3 mr-1.5" />
            Add Skill
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="technical" className="w-full">
          <TabsList className="w-full grid grid-cols-3 gap-0 mb-6">
            <TabsTrigger value="technical" className="text-xs">
              Technical ({categorizedSkills.technical.length})
            </TabsTrigger>
            <TabsTrigger value="software" className="text-xs">
              Software ({categorizedSkills.software.length})
            </TabsTrigger>
            <TabsTrigger value="soft_skill" className="text-xs">
              Soft Skills ({categorizedSkills.soft_skill.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="technical" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorizedSkills.technical.map(renderSkillCard)}
            </div>
          </TabsContent>

          <TabsContent value="software" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorizedSkills.software.map(renderSkillCard)}
            </div>
          </TabsContent>

          <TabsContent value="soft_skill" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorizedSkills.soft_skill.map(renderSkillCard)}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

