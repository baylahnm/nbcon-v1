import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../../../../../1-HomePage/others/components/ui/radio-group';
import { Label } from '../../../../../1-HomePage/others/components/ui/label';
import { Separator } from '../../../../../1-HomePage/others/components/ui/separator';
import {
  Brain,
  CheckCircle2,
  Clock,
  Target,
  Award,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Star,
  ArrowRight,
  RotateCcw,
  Download,
  Share2
} from 'lucide-react';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  skill: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface AssessmentResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: string;
  skillScores: SkillScore[];
  recommendations: Recommendation[];
  certificate?: {
    id: string;
    title: string;
    downloadUrl: string;
  };
}

interface SkillScore {
  skill: string;
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
}

interface Recommendation {
  type: 'course' | 'path' | 'practice';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  id: string;
}

interface SkillAssessmentProps {
  assessment: {
    id: string;
    title: string;
    description: string;
    duration: string;
    totalQuestions: number;
    skills: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    questions: AssessmentQuestion[];
  };
  onComplete: (result: AssessmentResult) => void;
  onRetake: () => void;
  isCompleted?: boolean;
  result?: AssessmentResult;
}

export function SkillAssessment({ 
  assessment, 
  onComplete, 
  onRetake, 
  isCompleted = false,
  result 
}: SkillAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(assessment.totalQuestions).fill(-1));
  const [timeSpent, setTimeSpent] = useState(0);
  const [showResult, setShowResult] = useState(isCompleted);

  // Timer effect
  React.useEffect(() => {
    if (!isCompleted && !showResult) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCompleted, showResult]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    const correctAnswers = answers.filter((answer, index) => 
      answer === assessment.questions[index].correctAnswer
    ).length;

    const score = Math.round((correctAnswers / assessment.totalQuestions) * 100);

    // Calculate skill scores
    const skillScores: SkillScore[] = assessment.skills.map(skill => {
      const skillQuestions = assessment.questions.filter(q => q.skill === skill);
      const correctSkillAnswers = answers.filter((answer, index) => 
        skillQuestions.some(q => q.id === assessment.questions[index].id) && 
        answer === assessment.questions[index].correctAnswer
      ).length;
      
      const skillScore = Math.round((correctSkillAnswers / skillQuestions.length) * 100);
      
      let level: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
      if (skillScore >= 80) level = 'Advanced';
      else if (skillScore >= 60) level = 'Intermediate';

      return {
        skill,
        score: skillScore,
        level,
        description: `You scored ${skillScore}% in ${skill}`
      };
    });

    // Generate recommendations
    const recommendations: Recommendation[] = skillScores
      .filter(skill => skill.score < 70)
      .map(skill => ({
        type: 'course' as const,
        title: `Improve Your ${skill.skill} Skills`,
        description: `Take our recommended courses to strengthen your ${skill.skill.toLowerCase()} knowledge`,
        priority: skill.score < 50 ? 'high' as const : 'medium' as const,
        id: `rec-${skill.skill.toLowerCase()}`
      }));

    const assessmentResult: AssessmentResult = {
      totalQuestions: assessment.totalQuestions,
      correctAnswers,
      score,
      timeSpent: formatTime(timeSpent),
      skillScores,
      recommendations,
      certificate: score >= 70 ? {
        id: `cert-${assessment.id}`,
        title: `${assessment.title} Assessment Certificate`,
        downloadUrl: `/api/certificates/${assessment.id}.pdf`
      } : undefined
    };

    onComplete(assessmentResult);
    setShowResult(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (showResult && result) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Result Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                {result.score >= 70 ? (
                  <Award className="h-8 w-8 text-white" />
                ) : (
                  <Brain className="h-8 w-8 text-white" />
                )}
              </div>
              <h2 className="text-2xl font-bold">Assessment Complete!</h2>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{result.score}%</p>
                  <p className="text-sm text-muted-foreground">Final Score</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{result.correctAnswers}</p>
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{result.timeSpent}</p>
                  <p className="text-sm text-muted-foreground">Time Spent</p>
                </div>
              </div>
              {result.certificate && (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Certificate Earned!
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skill Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.skillScores.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={getScoreBadgeVariant(skill.score)}>
                        {skill.score}%
                      </Badge>
                      <Badge variant="outline">
                        {skill.level}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={skill.score} className="h-2" />
                  <p className="text-sm text-muted-foreground">{skill.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recommended Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge 
                          variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onRetake}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Assessment
          </Button>
          {result.certificate && (
            <Button variant="outline" onClick={() => window.open(result.certificate!.downloadUrl)}>
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          )}
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.totalQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Assessment Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{assessment.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{assessment.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Question {currentQuestion + 1} of {assessment.totalQuestions}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question Info */}
            <div className="flex items-center gap-2">
              <Badge variant="outline">{currentQ.skill}</Badge>
              <Badge variant={currentQ.difficulty === 'Easy' ? 'default' : currentQ.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                {currentQ.difficulty}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{currentQ.question}</h3>
            
            <RadioGroup
              value={answers[currentQuestion]?.toString() || ''}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-3"
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          {answers.map((answer, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestion 
                  ? 'bg-primary' 
                  : answer !== -1 
                    ? 'bg-green-500' 
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Button 
          onClick={handleNext}
          disabled={answers[currentQuestion] === -1}
        >
          {currentQuestion === assessment.questions.length - 1 ? 'Finish' : 'Next'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
