import './App.css'
import { useTranslation } from 'react-i18next';
import { Outlet } from "react-router-dom";  
import { Layout, Button } from 'antd';
import Nav from './components/nav/nav.jsx';

function App() {
  const { t , i18n } = useTranslation();
  const { Header, Content, Footer } = Layout;

  return (
    <Layout style={{minHeight: '100vh', minWidth: '100vw'}}>
      <Header>
          <Nav/>
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
