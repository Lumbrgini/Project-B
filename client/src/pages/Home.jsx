import { useTranslation } from 'react-i18next';
import AddDrinkOverlay from '../components/addDrinkOverlay/addDrinkOverlay';
import DrinkHistory from '../components/dashboard/drinkHistory/drinkHistory';
import AllTimeStats from '../components/dashboard/allTimeStats/allTimeStats';
import Status from '../components/dashboard/status/status';
import {useEffect, useState} from 'react';

const handleDrinkAdded = () => {
    console.log("fetch drinks")
    //fetchDrinks(); // reload after modal submit
};

/*const userData = {
    id: 1,
    name: "Tester Testington1",
    height: 180,
    wight: 80,
    age: 25,
    drinks: [
        {
            name: "Mystery Beer 1",
            timestamp: Date.now(),
            ingredients: [{
                volume: 0.33,
                unit: "l",
                abv: 5,
            }],
        },
        {
            name: "Mystery Beer 2",
            timestamp: Date.now(),
            ingredients: [{
                volume: 0.33,
                unit: "l",
                abv: 5,
            }],
        }
    ]
}*/

function Home() {

    const { t, i18n } = useTranslation();
    const [userData, setUserData] = useState(null);
    

    useEffect(() => {
    fetch("/api/home")
        .then(async res => {
        if (!res.ok) return [];
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch {
            return [];
        }
        })
        .then(raw => {
            const safe = Array.isArray(raw) ? raw[0] : null;
            if (!safe) {
                setUserData(null);
                return;
        }

        const normalized = {
            id: safe.id,
            name: safe.name,
            height: safe.height,
            weight: safe.weight,
            age: safe.age,
            drinks: safe.drink.map(d => ({
            name: d.name,
            timestamp: new Date(d.date).getTime(), 
            ingredients: d.ingridients.map(ing => ({
                volume: ing.amount,   
                unit: "ml",             
                abv: ing.alcdegree       
            }))
            }))
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
            <h1>{t('home.title')}</h1>
            <DrinkHistory userData={userData} />
            <AllTimeStats userData={userData} />
            <Status userData={userData} />
            <AddDrinkOverlay afterCloseHandler={handleDrinkAdded} />
        </>
    )
}

export default Home