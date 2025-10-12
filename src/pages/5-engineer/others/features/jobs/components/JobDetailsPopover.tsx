import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../../1-HomePage/others/components/ui/dialog';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { X, Sparkles, Calculator, Target, TrendingUp } from 'lucide-react';
import { AIJobMatchScore } from './AIJobMatchScore';
import { EarningsCalculator } from './EarningsCalculator';
import { SkillsGapAnalysis } from './SkillsGapAnalysis';
import { SimilarJobsRecommendations } from './SimilarJobsRecommendations';

interface JobDetailsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  job: any; // Replace with proper job type
}

export default function JobDetailsPopover({ isOpen, onClose, job }: JobDetailsPopoverProps) {
  // Don't render if job is null or undefined
  if (!job || !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 bg-background border-b p-6 pb-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary h-10 w-10 flex items-center justify-center rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">{job.title || 'Job Details'}</DialogTitle>
                <p className="text-sm text-muted-foreground">{job.company || 'Company'}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* AI Match Score Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary h-6 w-6 flex items-center justify-center rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold">AI Match Score</h3>
            </div>
            <AIJobMatchScore 
              jobId={job.id}
              jobSkills={job.skills || ["Structural Analysis", "AutoCAD", "Project Management"]}
              overallMatch={job.id === '1' ? 92 : job.id === '2' ? 85 : 78}
            />
          </div>

          {/* Earnings Calculator Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-500 h-6 w-6 flex items-center justify-center rounded-lg">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold">Earnings Calculator</h3>
            </div>
            <EarningsCalculator />
          </div>

          {/* Skills Gap Analysis Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 h-6 w-6 flex items-center justify-center rounded-lg">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold">Skills Gap Analysis</h3>
            </div>
            <SkillsGapAnalysis 
              jobSkills={job.skills || ["Structural Analysis", "AutoCAD", "Project Management"]}
            />
          </div>

          {/* Similar Jobs Recommendations Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-purple-500 h-6 w-6 flex items-center justify-center rounded-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold">Similar Jobs You May Like</h3>
            </div>
            <SimilarJobsRecommendations />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
