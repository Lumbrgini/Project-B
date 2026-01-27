import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Row, Col, Statistic } from 'antd';
import { useAlcCalc } from 'src/hooks/useAlcCalc';

const { Title, Text } = Typography;


export default function AllTimeStats({ userData }) {

  const { t } = useTranslation();
  const { calculateCrates, calculateTotalAlcoholML } = useAlcCalc();

  const { totalAlcoholMl, totalCrates } = useMemo(() => {
    if (!userData || !Array.isArray(userData.drinks)) {
      return { totalAlcoholMl: 0, totalCrates: 0 };
    }

    let totalAlcoholMl = 0;
    let totalCrates = 0;

    userData.drinks.forEach((drink) => {
      totalAlcoholMl += calculateTotalAlcoholML(drink.ingredients);
      totalCrates += calculateCrates(drink.ingredients);
    });

    return { totalAlcoholMl, totalCrates };
  }, [userData, calculateCrates, calculateTotalAlcoholML]);
    

  if (!userData || !userData.drinks) {
    return <Text type="secondary">{t('history.noDrinks')}</Text>;
  }
    

  return (
    <Card
      title={<Title level={3}>{t('stats.title')}</Title>}
      style={{ maxWidth: 800, margin: '2rem auto', boxShadow: '0 2px 8px #f0f1f2' }}
    >
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Statistic
            title={t('stats.totalLabel')}
            value={Number(totalAlcoholMl || 0).toFixed(2)}
            suffix="ml"
          />
        </Col>
        <Col xs={24} md={12}>
          <Statistic
            title={t('stats.cratesLabel')}
            value={Number(totalCrates || 0).toFixed(2)}
            suffix={t('stats.cratesSuffix')}
          />
        </Col>
      </Row>
    </Card>
  );
}
