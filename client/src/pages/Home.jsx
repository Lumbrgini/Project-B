import { useTranslation } from 'react-i18next';
import AddDrinkOverlay from '../components/addDrinkOverlay/addDrinkOverlay';

   

function Home() {
    const { t, i18n } = useTranslation();
    return (
        <>
            <h1>{t('home.title')}</h1>
            <AddDrinkOverlay/>
        </>
    )
}

export default Home