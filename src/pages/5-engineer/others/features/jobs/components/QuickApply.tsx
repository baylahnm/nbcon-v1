import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../../../../1-HomePage/others/components/ui/dialog";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Textarea } from "../../../../../1-HomePage/others/components/ui/textarea";
import { Label } from "../../../../../1-HomePage/others/components/ui/label";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Progress } from "../../../../../1-HomePage/others/components/ui/progress";
import { 
  Zap, 
  CheckCircle,
  Upload,
  FileText,
  User,
  Award,
  Send,
  Sparkles,
  Briefcase
} from "lucide-react";

interface QuickApplyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  company: string;
  matchScore: number;
}

export function QuickApply({ 
  open, 
  onOpenChange,
  jobTitle,
  company,
  matchScore 
}: QuickApplyProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [useAIAssist, setUseAIAssist] = useState(false);

  // Mock user profile completeness
  const profileData = {
    personalInfo: 100,
    experience: 100,
    skills: 100,
    certifications: 100,
    portfolio: 80,
    resume: 100
  };

  const avgCompletion = Object.values(profileData).reduce((a, b) => a + b, 0) / Object.keys(profileData).length;

  const generateAICoverLetter = () => {
    const aiCoverLetter = `Dear Hiring Manager at ${company},

I am writing to express my strong interest in the ${jobTitle} position. With my extensive experience in structural engineering and proven track record of delivering complex projects, I am confident in my ability to contribute significantly to your team.

My expertise in STAAD.Pro, ETABS, and AutoCAD, combined with my 8+ years of experience, aligns perfectly with your requirements. I have successfully led numerous infrastructure projects in Saudi Arabia, consistently delivering high-quality results on time and within budget.

I am particularly excited about this opportunity because ${company} is known for its innovative approach and commitment to excellence. I look forward to bringing my skills and passion to your team.

Thank you for considering my application.

Best regards,
[Your Name]`;

    setCoverLetter(aiCoverLetter);
    setUseAIAssist(true);
  };

  const handleSubmit = () => {
    console.log("Quick applying to job:", { jobTitle, company, coverLetter });
    alert("Application submitted successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Quick Apply
          </DialogTitle>
          <DialogDescription>
            Apply to {jobTitle} at {company} with your pre-filled profile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Profile Completeness */}
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-green-600">Profile Readiness</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                {avgCompletion.toFixed(0)}% Complete
              </Badge>
            </div>
            <Progress value={avgCompletion} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Your profile is complete and ready for quick apply!
            </p>
          </div>

          {/* Auto-filled Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Pre-filled from Your Profile</h4>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Personal Info", value: "100%", icon: User },
                { label: "Experience", value: "8+ years", icon: Briefcase },
                { label: "Skills", value: "12 skills", icon: Award },
                { label: "Resume", value: "Updated", icon: FileText }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <item.icon className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Match Score */}
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold">AI Match Score</span>
              </div>
              <Badge className="bg-purple-600 text-white">
                {matchScore}% Match
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your profile is an excellent match for this position!
            </p>
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Cover Letter (Optional)</Label>
              <Button 
                size="sm" 
                variant="outline"
                onClick={generateAICoverLetter}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
            </div>
            <Textarea
              placeholder="Introduce yourself and explain why you're a great fit for this role..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="min-h-[200px]"
            />
            {useAIAssist && (
              <p className="text-xs text-purple-600">
                ✨ AI-generated cover letter. Feel free to customize it before sending.
              </p>
            )}
          </div>

          {/* Documents */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="space-y-2">
              {[
                { name: "Resume.pdf", size: "245 KB", status: "ready" },
                { name: "Portfolio.pdf", size: "1.2 MB", status: "ready" },
                { name: "SCE_License.pdf", size: "189 KB", status: "ready" }
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">{doc.size}</div>
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Add More Documents
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Send className="w-4 h-4" />
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

