import React, { useMemo } from "react";
import { Card, List, Typography, Tag, Divider, Row, Col, Statistic } from "antd";

const { Title, Text } = Typography;

export default function DrinkDashboard({ userData }) {
    if (!userData || !userData.drinks) {
        return <Text type="secondary">No drink data available.</Text>;
    }

    const { totalAlcoholMl, totalCrates } = useMemo(() => {
        let totalMl = 0;
        let totalCrates = 0;

        userData.drinks.forEach((drink) => {
            drink.ingredients.forEach((ing) => {
                const vol = parseFloat(ing.volume);
                const abv = parseFloat(ing.abv);
                if (!isNaN(vol) && !isNaN(abv)) {
                totalMl += vol * (abv / 100);
                }
            });
            totalCrates += drink.crates || 0;
        });
        return { totalAlcoholMl: totalMl, totalCrates };
    }, [userData]);

 
    return (
        <Card
            title={<Title level={3}>{userData.name}'s Recent Drinks</Title>}
            bordered={false}
            style={{ maxWidth: 800, margin: "2rem auto", boxShadow: "0 2px 8px #f0f1f2" }}
        >
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Statistic
                    title="Total Pure Alcohol Consumed"
                    value={totalAlcoholMl.toFixed(2)}
                    suffix="ml"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Statistic
                    title="Equivalent Beer Crates"
                    value={totalCrates.toFixed(2)}
                    suffix="crates"
                    />
                </Col>
            </Row>
        </Card>
    );
}
