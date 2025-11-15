
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

function People() {
  const { t } = useTranslation();
  const [people, setPeople] = useState([]);

useEffect(() => {
  fetch("/api/people")
    .then(async res => {
        const text = await res.text();
        try{
          return (JSON.parse(text));
        }
        catch{
           return []; 
        }
      })
    .then(data => {
      const safe = Array.isArray(data) ? data : [];
        setPeople(safe);
    })
    .catch(err => {
      console.error(err);
      setPeople([]);
    });
}, []);

  return (
    <>
      <h1>{t('people.title')}</h1>

      <div>
        {people.map((person) => (
          <div key = {person.id}>
            <h2><strong>{person.name}</strong></h2>
            <div><strong>Age:</strong> {person.age}</div>
            <div><strong>Height:</strong> {person.height}</div>
            <div><strong>Weight:</strong> {person.weight}</div>
            
            {person.drink.map((d, i) => (
               <div key = {i}>
                  <br/>

                  <strong>{d.name}</strong>
                  <br/>

                  {new Date(d.date).toLocaleString()}
                  <br/>

                  {d.ingridients.map((ingr, k) => (
                    <div key={k}>
                      <u>Amount</u>: {ingr.amount} mL<br/>
                      <u>Alc</u>: {ingr.alcdegree} %
                    </div>
                  ))}
               </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export default People
