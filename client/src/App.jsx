import './App.css'
import { useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";  
import { Layout, Button } from 'antd';
import Nav from './components/nav/nav.jsx';
import { router } from './router';

function App() {
  const { t , i18n } = useTranslation();
  const { Header, Content, Footer } = Layout;
   const location = useLocation();
   const isLoginPage = location.pathname === "/";

  return (
    <Layout style={{minHeight: '100vh', minWidth: '100vw'}}>
      <Header>
          {!isLoginPage?<Nav/>:null}
      </Header>
      <Content>
        <h2>{t('app.title')}</h2>
        <Outlet />
      </Content>
      <Footer>
        <div>
          <Button color="default" variant={i18n.language === 'de' ? 'outlined' : 'dashed'} onClick={() => i18n.changeLanguage('de')}>DE</Button>
          <Button color="default" variant={i18n.language === 'en' ? 'outlined' : 'dashed'} onClick={() => i18n.changeLanguage('en')}>EN</Button>
        </div>
      </Footer>
    </Layout>
  )
}

export default App
