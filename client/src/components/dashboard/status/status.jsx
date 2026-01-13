import { useTranslation } from 'react-i18next';
import { useAlcCalc } from '/src/hooks/useAlcCalc';
import { Card, List, Typography, Divider, Button } from 'antd';

const { Title, Text } = Typography;

export default function Status({ userData }) {
  const { t } = useTranslation();
  const { calcIntox } = useAlcCalc();
  const { currentBAC, hoursToSober, totalAlcoholMl } = calcIntox(userData);
    

  return (
    <Card
        
      title={<Title level={3}>{t('status.title')}</Title>}
      style={{ maxWidth: 800, margin: '2rem auto', boxShadow: '0 2px 8px #f0f1f2' }}
    >
      <p>{t('stats.totalLabel')}: {totalAlcoholMl} ml</p>
      <p>{t('status.bacLabel')}: {currentBAC}%</p>
      <p>{t('status.timeLabel')}: {hoursToSober} {t('hours')}</p>
    </Card>
  );
}