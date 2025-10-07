import { Button } from './1-HomePage/others/components/ui/button';
import { Card, CardContent } from './1-HomePage/others/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center border-0 shadow-large">
        <CardContent className="p-8">
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          <h1 className="text-xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/')} className="bg-gradient-primary hover:shadow-glow">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
