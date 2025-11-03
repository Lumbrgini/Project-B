
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

function People() {
  const { t } = useTranslation();
  const [people, setPeople] = useState([]);

   useEffect(() => {
    fetch("/api/people") 
      .then((res) => res.json())
      .then((data) => setPeople(data)) 
      .catch((err) => console.error(t('people.error'), err));
  }, []);

  return (
    <>
      <h1>{t('people.title')}</h1>

      <p>
        {people.map((person) => (
          <h3 key = {person.id}>
            <strong>{person.name}</strong>
            {person.drinks.map((drink, i) => (
               <h4 key = {i}>
                  {drink.drink_name}: {drink.amount} L
               </h4>
            ))}
          </h3>
        ))}
      </p>
    </>
  )
}

export default People
