import './App.css'
import { useTranslation } from 'react-i18next';
import { Outlet } from "react-router-dom";  

function App() {
  const { t , i18n } = useTranslation();

  return (
    <>
      <h2>{t('app.title')}</h2>
      <Outlet />
      <div>
        <button onClick={() => i18n.changeLanguage('de')}>DE</button>
        <button onClick={() => i18n.changeLanguage('en')}>EN</button>
      </div>
    </>
  )
}

export default App
