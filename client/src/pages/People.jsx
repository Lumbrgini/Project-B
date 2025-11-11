
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

function People() {
  const { t } = useTranslation();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/people", { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPeople(data);
      } catch (e) {
        console.error(t("people.error"), e);
        setErr(t("people.error"));
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

  if (loading) return <p>{t("loading")}</p>;
  if (err) return <p>{err}</p>;

  return (
    <>
      <h1>{t('people.title')}</h1>

      <div>
      <h2>{t("people.title")}</h2>
      {people.map((person) => (
        <div key={person.id}>
          <h3>{person.name}</h3>
          {(person.drinks ?? []).map((d, i) => (
            <p key={i}>
              {d.drink_name}: {d.amount} L
            </p>
          ))}
        </div>
      ))}
    </div>
    </>
  )
}

export default People
