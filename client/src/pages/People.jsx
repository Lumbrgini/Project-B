import { useTranslation } from 'react-i18next';

function People() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('people.title')}</h1>
    </>
  )
}

export default People
