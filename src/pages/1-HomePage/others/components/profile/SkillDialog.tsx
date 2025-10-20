import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';

interface Skill {
  name: string;
  level: number;
  category: "technical" | "software" | "management" | "communication";
  verified: boolean;
  yearsOfExperience?: number;
}

interface SkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: Skill) => void;
  skill?: Skill | null;
  title?: string;
}

export function SkillDialog({ isOpen, onClose, onSave, skill, title = "Add Skill" }: SkillDialogProps) {
  const [formData, setFormData] = useState<Skill>({
    name: '',
    level: 50,
    category: 'technical',
    verified: false,
    yearsOfExperience: 0
  });

  useEffect(() => {
    if (skill) {
      setFormData(skill);
    } else {
      setFormData({
        name: '',
        level: 50,
        category: 'technical',
        verified: false,
        yearsOfExperience: 0
      });
    }
  }, [skill, isOpen]);

  const handleSave = () => {
    if (!formData.name.trim()) return;
    
    onSave(formData);
    onClose();
  };

  const getLevelText = (level: number) => {
    if (level < 20) return 'Beginner';
    if (level < 40) return 'Basic';
    if (level < 60) return 'Intermediate';
    if (level < 80) return 'Advanced';
    return 'Expert';
  };

  const getLevelColor = (level: number) => {
    if (level < 20) return 'text-red-500';
    if (level < 40) return 'text-orange-500';
    if (level < 60) return 'text-yellow-500';
    if (level < 80) return 'text-blue-500';
    return 'text-green-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skillName">Skill Name</Label>
            <Input
              id="skillName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Structural Analysis, AutoCAD, Project Management"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: string) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="management">Management</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Proficiency Level: {getLevelText(formData.level)} ({formData.level}%)</Label>
            <div className="space-y-2">
              <Slider
                value={[formData.level]}
                onValueChange={([value]) => setFormData({ ...formData, level: value })}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
              <Progress value={formData.level} className="h-2" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsExperience">Years of Experience</Label>
            <Input
              id="yearsExperience"
              type="number"
              min="0"
              max="50"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="verified"
              checked={formData.verified}
              onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
              className="rounded border-gray-300"
            />
            <Label htmlFor="verified" className="text-sm">
              This skill is verified (certified or tested)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name.trim()}>
            {skill ? 'Update' : 'Add'} Skill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
