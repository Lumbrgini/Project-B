import { useTranslation } from 'react-i18next';

import DrinkHistory from '../components/dashboard/drinkHistory/drinkHistory';
import AllTimeStats from '../components/dashboard/allTimeStats/allTimeStats';
import Status from '../components/dashboard/status/status';
import {useEffect, useState} from 'react';

function Home() {

  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
    

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    fetch('/api/home', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then(async res => {
        if (res.status === 401) {
          console.warn('Unauthorized, maybe token expired');
          setUserData(null);
          return null;
        }

        if (!res.ok) {
          console.error('Fetch failed:', res.status);
          setUserData(null);
          return null;
        }

        // parse JSON directly
        const raw = await res.json();
        console.log(raw);
        return raw;
      })
      .then(raw => {
        if (!raw) return;

        const normalized = {
          id: raw.id,
          firstName: raw.first_name,
          lastName: raw.family_name,
          height: raw.height,
          weight: raw.weight,
          age: raw.age,
          drinks: Array.isArray(raw.drinks) ? raw.drinks.map(d => ({
            name: d.name,
            timestamp: new Date(d.timestamp).getTime(),
            ingredients: d.ingredients.map(ing => ({
              volume: ing.volume,
              unit: ing.unit,
              abv: ing.abv,
            })),
          })) : [],
        };
            
        setUserData(normalized);
      })
      .catch(err => {
        console.error(err);
        setUserData(null);
      });
  }, []); 

  return (
    <>
            
      {
        userData &&
                <>
                  <h1>{t('home.title2')}</h1>
                  <span><em>{t('home.title1')}, {userData.firstName} {userData.lastName}</em></span><br/>
                </>
      }
      <DrinkHistory userData={userData} />
      <AllTimeStats userData={userData} />
      <Status userData={userData} />
    </>
  );
}

export default Home;