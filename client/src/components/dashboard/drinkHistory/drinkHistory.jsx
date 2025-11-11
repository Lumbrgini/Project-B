import React, { useState } from "react";
import { Card, List, Typography, Divider, Button } from "antd";
import { RightOutlined, DownOutlined } from "@ant-design/icons";
import { useAlcCalc } from "src/hooks/useAlcCalc";

const { Title, Text } = Typography;

export default function DrinkHistory({ userData }) {
  if (!userData || !userData.drinks || userData.drinks.length === 0) {
    return <Text type="secondary">No drink history available.</Text>;
  }

  // Show only last 10 drinks
  const lastTenDrinks = userData.drinks.slice(-10);

  return (
    <Card
      title={<Title level={3}>{userData.name}'s Recent Drinks</Title>}
      style={{ maxWidth: 800, margin: "2rem auto", boxShadow: "0 2px 8px #f0f1f2" }}
    >
      <List
        itemLayout="vertical"
        dataSource={lastTenDrinks}
        renderItem={(drink) => <DrinkItem key={drink.timestamp} drink={drink} />}
      />
    </Card>
  );
}

function DrinkItem({ drink }) {
    const {calculateTotalAlcoholML, calculateTotalAlcoholG} = useAlcCalc();
    const [expanded, setExpanded] = useState(false);

    const totalAlcoholMl = calculateTotalAlcoholML(drink.ingredients);
    const totalAlcoholGrams = calculateTotalAlcoholG(drink.ingredients);

  return (
    <List.Item
      style={{
        background: "#fafafa",
        borderRadius: 12,
        marginBottom: 16,
        padding: "1rem 1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {expanded ? <DownOutlined /> : <RightOutlined />}
          <Title level={4} style={{ margin: 0 }}>{drink.name}</Title>
        </div>

        <Text strong>
          {totalAlcoholMl.toFixed(1)} ml / {totalAlcoholGrams.toFixed(1)} g ethanol
        </Text>
      </div>

      <Divider style={{ margin: "8px 0" }} />

      {expanded && (
        <List
          size="small"
          style={{ marginTop: 8 }}
          dataSource={drink.ingredients}
          renderItem={(ing) => (
            <List.Item style={{ padding: "4px 0" }}>
              <Text>
                {ing.volume}
                {ing.unit} @ {ing.abv}% ABV
              </Text>
            </List.Item>
          )}
        />
      )}
    </List.Item>
  );
}