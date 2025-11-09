import { useTranslation } from 'react-i18next';
import AddDrinkOverlay from '../components/addDrinkOverlay/addDrinkOverlay';
import DrinkHistory from '../components/dashboard/drinkHistory/drinkHistory';
import AllTimeStats from '../components/dashboard/allTimeStats/allTimeStats';
import Status from '../components/dashboard/status/status';

const handleDrinkAdded = () => {
    console.log("fetch drinks")
    //fetchDrinks(); // reload after modal submit
};
  

const userData = {
    id: 1,
    name: "Tester Testington1",
    height: "180",
    wight: "80",
    age: "25",
    drinks: [
        {
        name: "Mystery Mix",
        timestamp: Date.now(),
        ingredients: [
            {
            volume: "0.25",
            unit: "ml",
            abv: "0",
            },
            {
            volume: "0.25",
            unit: "ml",
            abv: "30",
            }
        ],
        crates: 0.41666
        },
        {
        name: "Mystery Mix 2",
        timestamp: Date.now(),
        ingredients: [
            {
            volume: "0.25",
            unit: "ml",
            abv: "0",
            },
            {
            volume: "0.25",
            unit: "ml",
            abv: "30",
            }
        ],
        crates: 0.41666
        }
    ]
}

function Home() {
    const { t, i18n } = useTranslation();
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