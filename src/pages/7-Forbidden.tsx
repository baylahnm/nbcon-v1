import { useTranslation } from 'react-i18next';

export default function Forbidden() {
  const { t } = useTranslation('common');

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-semibold mb-2">{t('errors.forbidden.title')}</h1>
      <p className="opacity-70">{t('errors.forbidden.message')}</p>
    </div>
  );
}


