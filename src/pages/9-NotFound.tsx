import { useTranslation } from 'react-i18next';
import { Button } from './1-HomePage/others/components/ui/button';
import { Card, CardContent } from './1-HomePage/others/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center border-0 shadow-large">
        <CardContent className="p-8">
          <div className="text-6xl font-bold text-primary mb-4">{t('errors.notFound.code')}</div>
          <h1 className="text-xl font-bold mb-2">{t('errors.notFound.title')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('errors.notFound.message')}
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/')} className="bg-gradient-primary hover:shadow-glow">
              <Home className="h-4 w-4 mr-2" />
              {t('actions.goHome')}
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('actions.goBack')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
