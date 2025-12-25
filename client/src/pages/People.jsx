
import { useEffect, useMemo, useState } from "react";
import { Table, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useAlcCalc } from "../hooks/useAlcCalc";
import { Row, Col } from "antd";

const { Title, Text } = Typography;

function People() {
  const { t } = useTranslation();
  const { calculateTotalAlcoholML, calculateCrates } = useAlcCalc();

  const [people, setPeople] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    fetch("/api/people", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(res => (res.ok ? res.json() : []))
      .then(data => setPeople(Array.isArray(data) ? data : []))
      .catch(() => setPeople([]));
  }, []);

  /**
   * Compute ranking data
   */
  const rankedPeople = useMemo(() => {
    return people
      .map(person => {
        const allIngredients =
          Array.isArray(person.drinks)
            ? person.drinks.flatMap(d => d.ingredients || [])
            : [];

        const totalAlcoholMl = calculateTotalAlcoholML(allIngredients);
        const crates = calculateCrates(allIngredients);

        return {
          key: person.id,
          name: `${person.first_name} ${person.family_name}`,
          alcoholMl: totalAlcoholMl,
          crates,
        };
      })
      .sort((a, b) => b.alcoholMl - a.alcoholMl)
      .slice(0, 10);
  }, [people, calculateTotalAlcoholML, calculateCrates]);

  const columns = [
    {
      title: t("people.rank"),
      render: (_, __, index) => <strong>{index + 1}</strong>,
      width: 80,
    },
    {
      title: t("people.name"),
      dataIndex: "name",
    },
    {
      title: t("people.alcohol_ml"),
      dataIndex: "alcoholMl",
      render: v => `${v.toFixed(1)} ml`,
      sorter: (a, b) => a.alcoholMl - b.alcoholMl,
    },
    {
      title: t("people.crates"),
      dataIndex: "crates",
      render: v => v.toFixed(2),
      sorter: (a, b) => a.crates - b.crates,
    },
  ];

  return (
    <>
      <Title level={2}>{t("people.title")}</Title>

      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={16} xl={14}>
          <Table
            columns={columns}
            dataSource={rankedPeople}
            pagination={false}
            bordered
          />
        </Col>
      </Row>
    </>
  );
}

export default People;