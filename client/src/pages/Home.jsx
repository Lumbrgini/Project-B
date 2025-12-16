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

function Home() {

    const { t, i18n } = useTranslation();
    const [userData, setUserData] = useState(null);
    

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            console.warn("No access token, user is not logged in");
            setUserData(null);
            return;
        }

        fetch("/api/home", {
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
            let raw;
            try {
                raw = JSON.parse(text);
            } catch {
                raw = [];
            }
            return raw;
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