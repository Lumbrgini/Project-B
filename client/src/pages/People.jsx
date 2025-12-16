
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

function People() {
  const { t } = useTranslation();
  const [people, setPeople] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.warn("No access token, user is not logged in");
      setUserData(null);
      return;
    }

    fetch("/api/people", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(async res => {

        if (res.status === 401) {
          console.warn("Unauthorized, maybe token expired");
          setUserData(null);
          return;
        }

        if (!res.ok) return [];
        
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
