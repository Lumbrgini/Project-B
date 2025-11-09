import React from "react";
import { Card, List, Typography, Tag, Divider } from "antd";

const { Title, Text } = Typography;




export default function DrinkHistory({ userData }) {

    if (!userData || !userData.drinks) {
        return <Text type="secondary">No drink history available.</Text>;
    }

    // Show only last 10 drinks
    const lastTenDrinks = userData.drinks.slice(-10);

    return (
        <Card
            title={<Title level={3}>{userData.name}'s Recent Drinks</Title>}
            bordered={false}
            style={{ maxWidth: 800, margin: "2rem auto", boxShadow: "0 2px 8px #f0f1f2" }}
        >
            <List
                itemLayout="vertical"
                dataSource={lastTenDrinks}
                renderItem={(drink) => (
                    <List.Item
                        key={drink.name}
                        style={{
                        background: "#fafafa",
                        borderRadius: 12,
                        marginBottom: 16,
                        padding: "1rem 1.5rem",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Title level={4} style={{ margin: 0 }}>{drink.name}</Title>
                            <Tag color="blue">{drink.crates.toFixed(2)} crate{drink.crates >= 2 ? "s" : ""}</Tag>
                        </div>

                        <Divider style={{ margin: "8px 0" }} />

                        <Text strong>Ingredients:</Text>
                        <List
                            size="small"
                            dataSource={drink.ingredients}
                            renderItem={(ing, index) => (
                                <List.Item style={{ padding: "4px 0" }}>
                                <Text>
                                    {ing.volume}
                                    {ing.unit} @ {ing.abv}% ABV
                                </Text>
                                </List.Item>
                            )}
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
}
