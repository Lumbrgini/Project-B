import React, { useMemo } from "react";
import { Card, Typography, Row, Col, Statistic } from "antd";
import { useAlcCalc } from "src/hooks/useAlcCalc";

const { Title, Text } = Typography;


export default function AllTimeStats({ userData }) {
    if (!userData || !userData.drinks) {
        return <Text type="secondary">No drink data available.</Text>;
    }
    const { calculateCrates, calculateTotalAlcoholML } = useAlcCalc();

    const { totalAlcoholMl, totalCrates } = useMemo(() => {
        let totalAlcoholMl = 0;
        let totalCrates = 0;

        userData.drinks.forEach((drink) => {
            totalAlcoholMl += calculateTotalAlcoholML(drink.ingredients);
            totalCrates += calculateCrates(drink.ingredients);
        });
        return { totalAlcoholMl, totalCrates };
    }, [userData]);

    console.log({ totalAlcoholMl });
    return (
        <Card
            title={<Title level={3}>{userData.name}'s Recent Drinks</Title>}
            style={{ maxWidth: 800, margin: "2rem auto", boxShadow: "0 2px 8px #f0f1f2" }}
        >
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Statistic
                    title="Total Pure Alcohol Consumed"
                    value={Number(totalAlcoholMl || 0).toFixed(2)}
                    suffix="ml"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Statistic
                    title="Equivalent Beer Crates"
                    value={Number(totalCrates || 0).toFixed(2)}
                    suffix="crates"
                    />
                </Col>
            </Row>
        </Card>
    );
}
