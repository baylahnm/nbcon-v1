import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/card';

const FAQSection = () => {
  const { t } = useTranslation('homepage');
  
  return (
    <section className="py-16 md:py-24 lg:py-32 px-6 md:px-8 lg:px-12 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('faq.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">{t('faq.questions.verification.question')}</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  {t('faq.questions.verification.answer')}
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">{t('faq.questions.payment.question')}</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  {t('faq.questions.payment.answer')}
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">{t('faq.questions.milestones.question')}</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  {t('faq.questions.milestones.answer')}
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">{t('faq.questions.mobile.question')}</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  {t('faq.questions.mobile.answer')}
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">{t('faq.questions.getStarted.question')}</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  {t('faq.questions.getStarted.answer')}
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">{t('faq.questions.projectTypes.question')}</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  {t('faq.questions.projectTypes.answer')}
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">{t('faq.questions.aiHelp.question')}</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  {t('faq.questions.aiHelp.answer')}
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">{t('faq.questions.enterpriseSupport.question')}</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  {t('faq.questions.enterpriseSupport.answer')}
                </p>
              </div>
            </details>
          </Card>
        </div>
      </div>
    </section>
  );
};

export { FAQSection };
