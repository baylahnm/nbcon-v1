import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';

interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  client: string;
  location: string;
  value: string;
  duration: string;
  status: "completed" | "ongoing" | "planning";
  images: string[];
  skills: string[];
}

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: PortfolioProject) => void;
  project?: PortfolioProject | null;
  title?: string;
}

export function ProjectDialog({ isOpen, onClose, onSave, project, title = "Add Project" }: ProjectDialogProps) {
  const [formData, setFormData] = useState<PortfolioProject>({
    id: '',
    name: '',
    description: '',
    client: '',
    location: '',
    value: '',
    duration: '',
    status: 'completed',
    images: [],
    skills: []
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        id: Date.now().toString(),
        name: '',
        description: '',
        client: '',
        location: '',
        value: '',
        duration: '',
        status: 'completed',
        images: [],
        skills: []
      });
    }
  }, [project, isOpen]);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim()) return;
    
    onSave(formData);
    onClose();
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., NEOM Smart City Infrastructure"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g., NEOM Development Company"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the project, your role, and key achievements..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., NEOM, Tabuk Province"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Project Value</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="e.g., 1,250,000 SAR"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 18 months"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Project Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Skills Used</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a skill..."
              />
              <Button type="button" onClick={addSkill} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name.trim() || !formData.description.trim()}>
            {project ? 'Update' : 'Add'} Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
