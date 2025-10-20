import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  issuer: string;
  type: "award" | "certification" | "recognition" | "milestone";
}

interface AchievementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (achievement: Achievement) => void;
  achievement?: Achievement | null;
  title?: string;
}

export function AchievementDialog({ isOpen, onClose, onSave, achievement, title = "Add Achievement" }: AchievementDialogProps) {
  const [formData, setFormData] = useState<Achievement>({
    id: '',
    title: '',
    description: '',
    date: '',
    issuer: '',
    type: 'award'
  });

  useEffect(() => {
    if (achievement) {
      setFormData(achievement);
    } else {
      setFormData({
        id: Date.now().toString(),
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        issuer: '',
        type: 'award'
      });
    }
  }, [achievement, isOpen]);

  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.issuer.trim()) return;
    
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Achievement Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Excellence in Structural Engineering Award"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: string) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="award">Award</SelectItem>
                <SelectItem value="certification">Certification</SelectItem>
                <SelectItem value="recognition">Recognition</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer">Issuer/Organization</Label>
            <Input
              id="issuer"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              placeholder="e.g., Saudi Council of Engineers"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date Received</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the achievement and its significance..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.title.trim() || !formData.description.trim() || !formData.issuer.trim()}>
            {achievement ? 'Update' : 'Add'} Achievement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
